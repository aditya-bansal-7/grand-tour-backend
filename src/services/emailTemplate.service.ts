import { prisma } from '../config/db';

class EmailTemplateService {
  async getTemplates() {
    return await prisma.emailTemplate.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async getTemplateById(id: string) {
    return await prisma.emailTemplate.findUnique({
      where: { id }
    });
  }

  async getTemplateByName(name: string) {
    return await prisma.emailTemplate.findUnique({
      where: { name }
    });
  }

  async createTemplate(data: { name: string, subject: string, body: string, variables: string[] }) {
    return await prisma.emailTemplate.create({
      data
    });
  }

  async updateTemplate(id: string, data: { name?: string, subject?: string, body?: string, variables?: string[] }) {
    return await prisma.emailTemplate.update({
      where: { id },
      data
    });
  }

  async deleteTemplate(id: string) {
    return await prisma.emailTemplate.delete({
      where: { id }
    });
  }

  // Initialize default templates if they don't exist
  async seedTemplates() {
    const defaults = [
      {
        name: 'HOSTEL_ASSIGNMENT',
        subject: 'Hostel Assignment - {{hotelName}}',
        body: '<h1>Hostel Assigned</h1><p>Hi {{studentName}},</p><p>You have been assigned to <strong>{{hotelName}}</strong>.</p><p>Check-in: {{checkIn}}</p><p>Check-out: {{checkOut}}</p>',
        variables: ['studentName', 'hotelName', 'checkIn', 'checkOut', 'applicationId']
      },
      {
        name: 'PAYMENT_CONFIRMATION',
        subject: 'Payment Confirmation - {{paymentType}}',
        body: '<h1>Payment Received</h1><p>Hi {{studentName}},</p><p>We have received your payment of {{amount}} for {{paymentType}}.</p>',
        variables: ['studentName', 'amount', 'paymentType', 'applicationId']
      },
      {
        name: 'APPLICATION_UPDATE',
        subject: 'Application Status Update',
        body: '<h1>Status Updated</h1><p>Hi {{studentName}},</p><p>Your application status has been updated to: <strong>{{status}}</strong>.</p><p>Notes: {{notes}}</p>',
        variables: ['studentName', 'status', 'notes', 'applicationId']
      }
    ];

    for (const template of defaults) {
      await prisma.emailTemplate.upsert({
        where: { name: template.name },
        update: {},
        create: template
      });
    }
  }
}

export default new EmailTemplateService();
