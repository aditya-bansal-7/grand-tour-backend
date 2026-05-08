import { prisma } from '../config/db';
import { PaymentStatus } from '@prisma/client';

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
    return await prisma.payment.update({
      where: { id },
      data: { status },
      include: {
        user: true,
      },
    });
  }
}

export default new PaymentService();
