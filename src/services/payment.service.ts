import { prisma } from '../config/db';
import { PaymentStatus } from '@prisma/client';
import emailService from './email.service';


class PaymentService {
  async createPayment(data: {
    userId: string;
    applicationId: string;
    amount: number;
    description?: string;
    utrNumber: string;
    screenshotUrl: string;
  }) {
    return await prisma.payment.create({
      data: {
        userId: data.userId,
        applicationId: data.applicationId,
        amount: data.amount,
        description: data.description,
        utrNumber: data.utrNumber,
        screenshotUrl: data.screenshotUrl,
        status: PaymentStatus.PENDING,
      },
    });
  }

  async getAllPayments() {
    return await prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updatePaymentStatus(id: string, status: PaymentStatus) {
    const payment = await prisma.payment.update({
      where: { id },
      data: { status },
      include: {
        user: true,
      },
    });

    if (status === PaymentStatus.COMPLETED) {
      try {
        await emailService.sendPaymentConfirmationEmail(payment.user.email, {
          studentName: `${payment.user.firstName} ${payment.user.lastName}`,
          amount: payment.amount.toString(),
          paymentType: payment.description || 'Application Fee',
          applicationId: payment.applicationId
        });
      } catch (error) {
        console.error('Failed to send payment confirmation email:', error);
      }
    }

    return payment;

  }
}

export default new PaymentService();
