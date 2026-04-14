export declare enum JobType {
    INTERNSHIP = "Internship",
    FULL_TIME = "Full-time"
}
export declare enum JobStatus {
    OPEN = "Open",
    CLOSED = "Closed",
    HIRING_DONE = "Hiring Done"
}
export interface IJob {
    title: string;
    company: string;
    location: string;
    stipend: string;
    openings: number;
    applyBy: Date;
    type: JobType;
    status: JobStatus;
    campus: string;
    authorId: string;
    logo?: string;
}
//# sourceMappingURL=job.types.d.ts.map