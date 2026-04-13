export declare enum UserRole {
    ADMIN = "ADMIN",
    MODERATOR = "MODERATOR"
}
export declare enum HttpStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}
export interface IUser {
    _id: string;
    email: string;
    role: UserRole;
    campus: string;
    createdAt: Date;
}
export interface ITokenPayload {
    userId: string;
    role: UserRole;
    campus: string;
}
//# sourceMappingURL=auth.types.d.ts.map