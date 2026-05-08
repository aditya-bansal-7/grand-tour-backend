import { prisma } from '../config/db';
import { ApplicationStatus } from '@prisma/client';

class ApplicationService {
  async createApplication(data: any) {
    return await prisma.application.upsert({
      where: { userId: data.userId },
      update: {
        status: data.status,
        currentStepId: data.currentStepId,
        notes: data.notes,
        data: data.data, // This now stores the nested Stage > Section > Field structure
      },
      create: {
        userId: data.userId,
        status: data.status || 'DRAFT',
        currentStepId: data.currentStepId || 'application',
        notes: data.notes,
        data: data.data || {},
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

  async updateApplicationCurrentStep(id: string, currentStepId: string) {
    return await prisma.application.update({
      where: { id },
      data: { currentStepId },
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

  async getApplicationByUserId(userId: string) {
    return await prisma.application.findFirst({
      where: { userId },
      include: {
        user: true,
        interviews: {
          orderBy: { scheduledAt: 'desc' },
          take: 1
        },
        documents: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });
  }

  async deleteApplication(id: string) {
    return await prisma.application.delete({
      where: { id },
    });
  }
}

export default new ApplicationService();
