import { UserRole } from "../../IUser";

export interface IAddUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    parentId: string | null; // Only super admin can use this field, ignored otherwise
    role: UserRole | null; // Only super admin can use this field, ignored otherwise
}