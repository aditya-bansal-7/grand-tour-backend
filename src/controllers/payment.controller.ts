import { Request, Response } from 'express';
import paymentService from '../services/payment.service';
import activityService from '../services/activity.service';
import notificationService from '../services/notification.service';
import { PaymentStatus } from '@prisma/client';
import { prisma } from '../config/db';

export const submitPayment = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { amount, description, utrNumber, screenshotUrl } = req.body;

  const payment = await paymentService.createPayment({
    userId,
    amount: parseFloat(amount),
    description,
    utrNumber,
    screenshotUrl,
  });

  // Log activity
  await activityService.log(
    `Payment submitted: ₹${amount} (UTR: ${utrNumber})`,
    'PAYMENT_SUBMITTED',
    null,
    userId
  );

  res.status(201).json({
    success: true,
    data: payment,
  });
};

export const getPayments = async (req: Request, res: Response) => {
  const payments = await paymentService.getAllPayments();
  res.status(200).json({
    success: true,
    data: payments,
  });
};

export const approvePayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // COMPLETED or FAILED

  const payment = await paymentService.updatePaymentStatus(id, status as PaymentStatus);

  // Log activity
  await activityService.log(
    `Payment ${status.toLowerCase()}: ₹${payment.amount}`,
    'PAYMENT_UPDATE',
    null,
    (req as any).user?.id
  );

  // Notify user
  await notificationService.notify(
    payment.userId,
    'Payment Update',
    `Your payment of ₹${payment.amount} has been ${status === 'COMPLETED' ? 'approved' : 'rejected'}.`,
    status === 'COMPLETED' ? 'SUCCESS' : 'ERROR'
  );

  // If payment is completed, move application to hotel step
  if (status === 'COMPLETED') {
    const application = await prisma.application.findFirst({
      where: { userId: payment.userId }
    });
    
    if (application) {
      await prisma.application.update({
        where: { id: application.id },
        data: { currentStepId: 'hotel' }
      });
      
      await activityService.log(
        'Application moved to Hotel Allocation step',
        'APPLICATION_MOVE',
        application.id,
        (req as any).user?.id
      );
    }
  }

  res.status(200).json({
    success: true,
    data: payment,
  });
};
