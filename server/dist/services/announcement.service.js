import Announcement from '../models/Announcement.model.js';
/**
 * Fetches announcements for a specific campus with basic pagination.
 */
export const getAnnouncementsByCampus = async (campus, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [announcements, total] = await Promise.all([
        Announcement.find({ campus })
            .sort({ pinned: -1, createdAt: -1 }) // Pinned first, then newest
            .skip(skip)
            .limit(limit)
            .lean(),
        Announcement.countDocuments({ campus }),
    ]);
    return {
        announcements: announcements,
        total
    };
};
/**
 * Fetches a single announcement by ID, verified by campus.
 */
export const getAnnouncementById = async (id, campus) => {
    return Announcement.findOne({ _id: id, campus });
};
/**
 * Creates a new announcement.
 */
export const createAnnouncement = async (data) => {
    const announcement = new Announcement(data);
    return announcement.save();
};
/**
 * Updates an announcement, verified by campus.
 */
export const updateAnnouncement = async (id, campus, data) => {
    return Announcement.findOneAndUpdate({ _id: id, campus }, { $set: data }, { new: true, runValidators: true });
};
/**
 * Deletes an announcement, verified by campus.
 */
export const deleteAnnouncement = async (id, campus) => {
    return Announcement.findOneAndDelete({ _id: id, campus });
};
//# sourceMappingURL=announcement.service.js.map