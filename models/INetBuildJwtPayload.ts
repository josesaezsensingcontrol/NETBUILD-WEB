import { JwtPayload } from "jwt-decode";

export interface INetBuildJwtPayload extends JwtPayload {
    iss?: string;
    sub?: string;
    aud?: string[] | string;
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
    sid: string;
    email: string;
    given_name: string;
    family_name: string;
    role: string;
}