export enum AnnouncementType {
  ACADEMIC = 'Academic',
  EVENT = 'Event',
  INFRASTRUCTURE = 'Infrastructure',
  FACILITY = 'Facility'
}

export interface IAnnouncement {
  title: string;
  content: string;
  type: AnnouncementType;
  pinned: boolean;
  campus: string;
  authorId: string;
}
