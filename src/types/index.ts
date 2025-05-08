import { Types } from 'mongoose';

export interface TokenPayload {
    sub: string;
    iss: string;
    _id: Types.ObjectId;
    name: string;
    email: string;
    role: Types.ObjectId;
    iat: number;
    exp: number;
}

export enum Roles {
    HR = 'HR',
    SUPE_ADMIN = 'SUPE_ADMIN',
    NOMAL_USER = 'NOMAL_USER',
}
