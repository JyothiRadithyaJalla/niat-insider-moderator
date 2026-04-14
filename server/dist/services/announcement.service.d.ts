import { IAnnouncementDocument } from '../models/Announcement.model.js';
import { AnnouncementType } from '../types/announcement.types.js';
/**
 * Fetches announcements for a specific campus with basic pagination.
 */
export declare const getAnnouncementsByCampus: (campus: string, page?: number, limit?: number) => Promise<{
    announcements: IAnnouncementDocument[];
    total: number;
}>;
/**
 * Fetches a single announcement by ID, verified by campus.
 */
export declare const getAnnouncementById: (id: string, campus: string) => Promise<IAnnouncementDocument | null>;
/**
 * Creates a new announcement.
 */
export declare const createAnnouncement: (data: {
    title: string;
    content: string;
    type: AnnouncementType;
    pinned?: boolean | undefined;
    campus: string;
    authorId: string;
}) => Promise<IAnnouncementDocument>;
/**
 * Updates an announcement, verified by campus.
 */
export declare const updateAnnouncement: (id: string, campus: string, data: Partial<{
    title: string | undefined;
    content: string | undefined;
    type: AnnouncementType | undefined;
    pinned: boolean | undefined;
}>) => Promise<IAnnouncementDocument | null>;
/**
 * Deletes an announcement, verified by campus.
 */
export declare const deleteAnnouncement: (id: string, campus: string) => Promise<IAnnouncementDocument | null>;
//# sourceMappingURL=announcement.service.d.ts.map