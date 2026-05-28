import { prisma } from '../config/db';

const defaultPageContent = {
  pageKey: 'application',
  title: 'Build Your Editorial Profile',
  subtitle: 'Phase 2: Defining your academic and professional coordinates.',
  blocks: [
    {
      id: 'section-personal-credentials',
      type: 'section',
      label: 'Personal Credentials',
      section: 'Personal Credentials',
      column: 'left',
      order: 1,
      enabled: true,
    },
    {
      id: 'full-name',
      type: 'user',
      label: 'Full Legal Name',
      fieldKey: 'fullName',
      valueSource: 'user.fullName',
      section: 'Personal Credentials',
      column: 'left',
      order: 2,
      disabled: true,
    },
    {
      id: 'primary-email',
      type: 'user',
      label: 'Primary Email',
      fieldKey: 'email',
      valueSource: 'user.email',
      section: 'Personal Credentials',
      column: 'left',
      order: 3,
      disabled: true,
    },
    {
      id: 'passport-number',
      type: 'text',
      label: 'Passport Number',
      fieldKey: 'passportNumber',
      placeholder: 'E1234567',
      section: 'Personal Credentials',
      column: 'left',
      order: 4,
      required: false,
    },
    {
      id: 'section-academic-nexus',
      type: 'section',
      label: 'Academic Nexus',
      section: 'Academic Nexus',
      column: 'left',
      order: 5,
      enabled: true,
    },
    {
      id: 'educational-institution',
      type: 'text',
      label: 'Educational Institution',
      fieldKey: 'educationalInstitution',
      placeholder: 'Metropolitan Institute of Technology',
      section: 'Academic Nexus',
      column: 'left',
      order: 6,
      required: false,
    },
    {
      id: 'enrollment-status',
      type: 'select',
      label: 'B.Tech Enrollment Status',
      fieldKey: 'enrollmentStatus',
      options: ['Active Candidate', 'Alumni'],
      defaultValue: 'Active Candidate',
      section: 'Academic Nexus',
      column: 'left',
      order: 7,
    },
    {
      id: 'section-journey-intent',
      type: 'section',
      label: 'Journey Intent',
      section: 'Journey Intent',
      column: 'right',
      order: 8,
      enabled: true,
    },
    {
      id: 'preferred-department',
      type: 'select',
      label: 'Preferred Department',
      fieldKey: 'preferredDepartment',
      options: ['Journalism', 'Digital Media', 'Publishing', 'Content Strategy'],
      section: 'Journey Intent',
      column: 'right',
      order: 9,
    },
    {
      id: 'cgpa',
      type: 'number',
      label: 'CGPA',
      fieldKey: 'cgpa',
      placeholder: '8.5',
      section: 'Academic Nexus',
      column: 'left',
      order: 8,
      required: false,
    },
    {
      id: 'passport-confirmation',
      type: 'checkbox',
      label: 'I confirm I have a valid passport',
      fieldKey: 'passportConfirmed',
      defaultValue: true,
      section: 'Personal Credentials',
      column: 'left',
      order: 9,
      required: true,
    },
    {
      id: 'statement-of-purpose',
      type: 'textarea',
      label: 'Statement of Purpose (250 Words)',
      fieldKey: 'statementOfPurpose',
      placeholder: 'Describe your vision for this editorial internship...',
      description: 'Tell us why this program matters to your editorial journey.',
      section: 'Journey Intent',
      column: 'right',
      order: 10,
      maxWords: 250,
    },
    {
      id: 'preferred-start-date',
      type: 'date',
      label: 'Preferred Start Date',
      fieldKey: 'preferredStartDate',
      section: 'Journey Intent',
      column: 'right',
      order: 11,
      required: false,
    },
  ],
};

class ApplicationPageContentService {
  async getPageContent(pageKey: string) {
    const content = await prisma.applicationPageContent.findUnique({
      where: { pageKey },
    });

    if (content) {
      return content;
    }

    return await this.seedPageContent(pageKey);
  }

  async seedPageContent(pageKey: string) {
    const payload = {
      ...defaultPageContent,
      pageKey,
    };

    return await prisma.applicationPageContent.upsert({
      where: { pageKey },
      update: {
        title: payload.title,
        subtitle: payload.subtitle,
        blocks: payload.blocks,
        isActive: true,
      },
      create: {
        pageKey: payload.pageKey,
        title: payload.title,
        subtitle: payload.subtitle,
        blocks: payload.blocks,
        isActive: true,
      },
    });
  }

  async updatePageContent(pageKey: string, data: any) {
    return await prisma.applicationPageContent.upsert({
      where: { pageKey },
      update: {
        title: data.title ?? defaultPageContent.title,
        subtitle: data.subtitle ?? defaultPageContent.subtitle,
        blocks: Array.isArray(data.blocks) ? data.blocks : defaultPageContent.blocks,
        isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
      },
      create: {
        pageKey,
        title: data.title ?? defaultPageContent.title,
        subtitle: data.subtitle ?? defaultPageContent.subtitle,
        blocks: Array.isArray(data.blocks) ? data.blocks : defaultPageContent.blocks,
        isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
      },
    });
  }
}

export default new ApplicationPageContentService();
