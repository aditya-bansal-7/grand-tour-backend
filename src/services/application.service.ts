import { prisma } from '../config/db';
import { ApplicationStatus } from '@prisma/client';

class ApplicationService {
  async createApplication(data: any) {
    return await prisma.application.create({
      data: {
        userId: data.userId,
        program: data.program,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        phone: data.phone,
      },
      include: {
        user: true,
      },
    });
  }

  async getAllApplications() {
    return await prisma.application.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          }
        },
        interviews: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateApplicationStatus(id: string, status: ApplicationStatus) {
    return await prisma.application.update({
      where: { id },
      data: { status },
    });
  }

  async updateApplicationNotes(id: string, notes: string) {
    return await prisma.application.update({
      where: { id },
      data: { notes },
    });
  }

  async updateApplicationStep(id: string, currentStepId: string) {
    return await prisma.application.update({
      where: { id },
      data: { currentStepId },
    });
  }

  async deleteApplication(id: string) {
    return await prisma.application.delete({
      where: { id },
    });
  }
}

export default new ApplicationService();
