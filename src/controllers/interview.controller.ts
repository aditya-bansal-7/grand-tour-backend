import { Request, Response } from 'express';
import interviewService from '../services/interview.service';

export const getInterviews = async (req: Request, res: Response) => {
  const interviews = await interviewService.getAllInterviews();
  res.status(200).json({
    success: true,
    data: interviews
  });
};

export const scheduleInterview = async (req: Request, res: Response) => {
  const interview = await interviewService.scheduleInterview(req.body);
  res.status(201).json({
    success: true,
    data: interview
  });
};

export const deleteInterview = async (req: Request, res: Response) => {
  const { id } = req.params;
  await interviewService.deleteInterview(id);
  res.status(200).json({
    success: true,
    message: 'Interview deleted successfully'
  });
};
