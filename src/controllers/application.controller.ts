import { Request, Response } from 'express';
import applicationService from '../services/application.service';
import { ApplicationStatus } from '@prisma/client';
import activityService from '../services/activity.service';
import notificationService from '../services/notification.service';

export const createApplication = async (req: Request, res: Response) => {
  const application = await applicationService.createApplication(req.body);
  res.status(201).json({
    success: true,
    data: application
  });
};

export const getApplications = async (req: Request, res: Response) => {
  const applications = await applicationService.getAllApplications();
  res.status(200).json({
    success: true,
    data: applications
  });
};

export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const application = await applicationService.updateApplicationStatus(id, status as ApplicationStatus);
  
  // Log activity
  await activityService.log(`Application status updated to ${status}`, 'STATUS_UPDATE', id, (req as any).user?.id);
  
  // Notify user
  await notificationService.notify(application.userId, 'Application Update', `Your application status has been updated to ${status}.`, 'INFO');

  res.status(200).json({
    success: true,
    data: application
  });
};

export const updateNotes = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { notes } = req.body;
  const application = await applicationService.updateApplicationNotes(id, notes);
  res.status(200).json({
    success: true,
    data: application
  });
};

export const updateStep = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { currentStepId } = req.body;
  const application = await applicationService.updateApplicationStep(id, currentStepId);
  
  // Log activity
  await activityService.log(`Moved to workflow step: ${currentStepId}`, 'STEP_UPDATE', id, (req as any).user?.id);

  res.status(200).json({
    success: true,
    data: application
  });
};

export const deleteApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  await applicationService.deleteApplication(id);
  res.status(200).json({
    success: true,
    message: 'Application deleted successfully'
  });
};
