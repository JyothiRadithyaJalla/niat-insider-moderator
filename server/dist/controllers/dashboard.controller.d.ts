import { Request, Response } from 'express';
export declare const getSchedules: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addSchedule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateSchedule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteSchedule: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTracks: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addTrack: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateTrack: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteTrack: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getEvents: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const addEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteEvent: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=dashboard.controller.d.ts.map