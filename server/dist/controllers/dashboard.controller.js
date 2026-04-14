import Schedule from '../models/Schedule.model.js';
import Track from '../models/Track.model.js';
import Event from '../models/Event.model.js';
import { HttpStatus } from '../types/auth.types.js';
/* ── Schedules ─────────────────────────────────────────────── */
export const getSchedules = async (req, res) => {
    try {
        if (!req.user)
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        const schedules = await Schedule.find({ campus: req.user.campus }).sort({ createdAt: 1 });
        res.json(schedules);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching schedules' });
    }
};
export const addSchedule = async (req, res) => {
    try {
        if (!req.user)
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        const schedule = await Schedule.create({ ...req.body, campus: req.user.campus, authorId: req.user.userId });
        res.status(HttpStatus.CREATED).json(schedule);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating schedule' });
    }
};
export const updateSchedule = async (req, res) => {
    try {
        if (!req.user)
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        const schedule = await Schedule.findOneAndUpdate({ _id: req.params.id, campus: req.user.campus }, req.body, { new: true });
        res.json(schedule);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating schedule' });
    }
};
export const deleteSchedule = async (req, res) => {
    try {
        if (!req.user)
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        await Schedule.findOneAndDelete({ _id: req.params.id, campus: req.user.campus });
        res.json({ message: 'Deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting schedule' });
    }
};
/* ── Tracks ────────────────────────────────────────────────── */
export const getTracks = async (req, res) => {
    try {
        if (!req.user)
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        const tracks = await Track.find({ campus: req.user.campus }).sort({ createdAt: 1 });
        res.json(tracks);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching tracks' });
    }
};
export const addTrack = async (req, res) => {
    try {
        if (!req.user)
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        const track = await Track.create({ ...req.body, campus: req.user.campus, authorId: req.user.userId });
        res.status(HttpStatus.CREATED).json(track);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating track' });
    }
};
export const updateTrack = async (req, res) => {
    try {
        if (!req.user)
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        const track = await Track.findOneAndUpdate({ _id: req.params.id, campus: req.user.campus }, req.body, { new: true });
        res.json(track);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating track' });
    }
};
export const deleteTrack = async (req, res) => {
    try {
        if (!req.user)
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        await Track.findOneAndDelete({ _id: req.params.id, campus: req.user.campus });
        res.json({ message: 'Deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting track' });
    }
};
/* ── Events ────────────────────────────────────────────────── */
export const getEvents = async (req, res) => {
    try {
        if (!req.user)
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        const events = await Event.find({ campus: req.user.campus }).sort({ createdAt: 1 });
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching events' });
    }
};
export const addEvent = async (req, res) => {
    try {
        if (!req.user)
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        const event = await Event.create({ ...req.body, campus: req.user.campus, authorId: req.user.userId });
        res.status(HttpStatus.CREATED).json(event);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating event' });
    }
};
export const deleteEvent = async (req, res) => {
    try {
        if (!req.user)
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' });
        await Event.findOneAndDelete({ _id: req.params.id, campus: req.user.campus });
        res.json({ message: 'Deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting event' });
    }
};
//# sourceMappingURL=dashboard.controller.js.map