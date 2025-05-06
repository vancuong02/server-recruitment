import { Types } from 'mongoose';

export interface TokenPayload {
    sub: string;
    iss: string;
    _id: Types.ObjectId;
    name: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}
