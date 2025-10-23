import { IUser, UserRole } from "../models/IUser";

export const getUserInitials: (user: IUser) => string = (user) => {
    return getInitials(user.firstName, user.lastName);
};

export const getInitials: (firstName: string | undefined, lastName: string | undefined) => string = (firstName, lastName) => {
    if(firstName === undefined) {
        throw new Error("Given Name not found");
    }

    if(lastName === undefined) {
        throw new Error("Last Name not found");
    }

    return firstName[0].toUpperCase() + lastName[0].toUpperCase();
};

export const getRoleName: (role: UserRole) => string = (role) => {
    switch (role) {
        case UserRole.SuperAdmin:
            return "SuperAdmin";
        case UserRole.Admin:
            return "Admin";
        case UserRole.User:
            return "User";
    }
}