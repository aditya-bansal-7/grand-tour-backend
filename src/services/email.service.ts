import nodemailer from 'nodemailer';
import { prisma } from '../config/db';
import logger from '../utils/logger';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(to: string, templateName: string, variables: Record<string, string>) {
    try {
      const template = await prisma.emailTemplate.findUnique({
        where: { name: templateName },
      });

      if (!template) {
        logger.error(`Email template ${templateName} not found`);
        throw new Error(`Email template ${templateName} not found`);
      }

      let subject = template.subject;
      let body = template.body;

      // Replace variables in subject and body
      Object.entries(variables).forEach(([key, value]) => {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(placeholder, value);
        body = body.replace(placeholder, value);
      });

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html: body,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  // Pre-defined flows
  async sendHostelAssignmentEmail(to: string, data: { 
    studentName: string, 
    hotelName: string, 
    checkIn: string, 
    checkOut: string,
    applicationId: string 
  }) {
    return this.sendEmail(to, 'HOSTEL_ASSIGNMENT', {
      studentName: data.studentName,
      hotelName: data.hotelName,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      applicationId: data.applicationId
    });
  }

  async sendPaymentConfirmationEmail(to: string, data: { 
    studentName: string, 
    amount: string, 
    paymentType: string,
    applicationId: string 
  }) {
    return this.sendEmail(to, 'PAYMENT_CONFIRMATION', {
      studentName: data.studentName,
      amount: data.amount,
      paymentType: data.paymentType,
      applicationId: data.applicationId
    });
  }

  async sendApplicationUpdateEmail(to: string, data: { 
    studentName: string, 
    status: string, 
    notes?: string,
    applicationId: string 
  }) {
    return this.sendEmail(to, 'APPLICATION_UPDATE', {
      studentName: data.studentName,
      status: data.status,
      notes: data.notes || 'No additional notes',
      applicationId: data.applicationId
    });
  }
}

export default new EmailService();
