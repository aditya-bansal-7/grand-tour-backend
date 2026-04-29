import { prisma } from '../config/db';

class InterviewService {
  async getAllInterviews() {
    return await prisma.interview.findMany({
      include: {
        application: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        },
        interviewer: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          }
        }
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });
  }

  async scheduleInterview(data: any) {
    const { applicationId, interviewerId, scheduledAt, locationUrl, notes } = data;
    return await prisma.interview.create({
      data: {
        applicationId,
        interviewerId,
        scheduledAt: new Date(scheduledAt),
        locationUrl,
        notes,
      }
    });
  }

  async deleteInterview(id: string) {
    return await prisma.interview.delete({
      where: { id },
    });
  }
}

export default new InterviewService();
