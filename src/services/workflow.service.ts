import { prisma } from '../config/db';

class WorkflowService {
  async getWorkflow() {
    let workflow = await prisma.workflow.findFirst({
      where: { isActive: true }
    });

    if (!workflow) {
      // Create a default workflow if none exists
      workflow = await this.initializeDefaultWorkflow();
    }

    return workflow;
  }

  async updateWorkflow(data: any) {
    const existing = await prisma.workflow.findFirst({
      where: { isActive: true }
    });

    if (existing) {
      return await prisma.workflow.update({
        where: { id: existing.id },
        data: {
          name: data.name || existing.name,
          description: data.description || existing.description,
          steps: data.steps || existing.steps,
        }
      });
    } else {
      return await prisma.workflow.create({
        data: {
          name: data.name || 'Grand Tour Process',
          description: data.description || 'The standard internship management workflow',
          steps: data.steps || [],
        }
      });
    }
  }

  private async initializeDefaultWorkflow() {
    return await prisma.workflow.create({
      data: {
        name: 'Grand Tour Process',
        description: 'Standard internship management workflow',
        steps: [
          {
            id: 'step1',
            name: 'Application received',
            description: 'Candidate applied for internship',
            order: 1,
            fields: [
              { id: 'f1', name: 'Resume', type: 'file', required: true }
            ]
          },
          {
            id: 'step2',
            name: 'Initial Screening',
            description: 'Review application and documents',
            order: 2,
            fields: [
              { id: 'f2', name: 'Screening Notes', type: 'textarea', required: false }
            ]
          },
          {
            id: 'step3',
            name: 'Technical Interview',
            description: 'Assessment of technical skills',
            order: 3,
            fields: [
              { id: 'f3', name: 'Score', type: 'number', required: true }
            ]
          }
        ]
      }
    });
  }
}

export default new WorkflowService();
