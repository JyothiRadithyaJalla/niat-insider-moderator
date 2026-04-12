export enum JobType {
  INTERNSHIP = 'Internship',
  FULL_TIME = 'Full-time'
}

export enum JobStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
  HIRING_DONE = 'Hiring Done'
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  stipend: string;
  openings: number;
  applyBy: string;
  type: JobType;
  status: JobStatus;
  campus: string;
  authorId: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}
