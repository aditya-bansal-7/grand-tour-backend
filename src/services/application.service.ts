import { prisma } from '../config/db';
import { ApplicationStatus } from '@prisma/client';
import emailService from './email.service';


class ApplicationService {
  async createApplication(data: any) {
    return await prisma.application.upsert({
      where: { userId: data.userId },
      update: {
        status: data.status,
        currentStepId: data.currentStepId,
        notes: data.notes,
        data: data.data,
        passportNumber: data.passportNumber,
        educationalInstitution: data.educationalInstitution,
        enrollmentStatus: data.enrollmentStatus,
        preferredDepartment: data.preferredDepartment,
        statementOfPurpose: data.statementOfPurpose,
        payment1Id: data.payment1Id || (data.payment1?.id),
        payment2Id: data.payment2Id || (data.payment2?.id),
      },
      create: {
        userId: data.userId,
        status: data.status || 'DRAFT',
        currentStepId: data.currentStepId || 'application',
        notes: data.notes,
        data: data.data || {},
        passportNumber: data.passportNumber,
        educationalInstitution: data.educationalInstitution,
        enrollmentStatus: data.enrollmentStatus,
        preferredDepartment: data.preferredDepartment,
        statementOfPurpose: data.statementOfPurpose,
        payment1Id: data.payment1Id || (data.payment1?.id),
        payment2Id: data.payment2Id || (data.payment2?.id),
      },
      include: {
        user: true,
        payment1: true,
        payment2: true,
        payments: true,
      },
    });
  }

  async updateApplication(id: string, data: any) {
    return await prisma.application.update({
      where: { id },
      data: {
        status: data.status,
        currentStepId: data.currentStepId,
        notes: data.notes,
        data: data.data,
        passportNumber: data.passportNumber,
        educationalInstitution: data.educationalInstitution,
        enrollmentStatus: data.enrollmentStatus,
        preferredDepartment: data.preferredDepartment,
        statementOfPurpose: data.statementOfPurpose,
        payment1Id: data.payment1Id || (data.payment1?.id),
        payment2Id: data.payment2Id || (data.payment2?.id),
      },
      include: {
        user: true,
        payment1: true,
        payment2: true,
        payments: true,
      }
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
    const application = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        user: true
      }
    });

    try {
      await emailService.sendApplicationUpdateEmail(application.user.email, {
        studentName: `${application.user.firstName} ${application.user.lastName}`,
        status: application.status,
        notes: application.notes || undefined,
        applicationId: application.id
      });
    } catch (error) {
      console.error('Failed to send application update email:', error);
    }

    return application;

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
        },
        payment1: true,
        payment2: true,
        payments: true,
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
