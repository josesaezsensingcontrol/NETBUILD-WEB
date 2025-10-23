export interface IUser {
    email: string;
    id: string;
    parentId?: string;
    firstName: string;
    lastName: string;
    initials: string;
    role: UserRole;
}

export enum UserRole {
    SuperAdmin,
    Admin,
    User
}