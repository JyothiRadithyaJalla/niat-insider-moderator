"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MODERATOR"] = "MODERATOR";
})(UserRole || (exports.UserRole = UserRole = {}));
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["CREATED"] = 201] = "CREATED";
    HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatus[HttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
})(HttpStatus || (exports.HttpStatus = HttpStatus = {}));
//# sourceMappingURL=auth.types.js.map