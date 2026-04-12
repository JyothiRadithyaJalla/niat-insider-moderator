export enum AnnouncementType {
  ACADEMIC = 'Academic',
  EVENT = 'Event',
  INFRASTRUCTURE = 'Infrastructure',
  FACILITY = 'Facility'
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  pinned: boolean;
  campus: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}
