import { IBuilding } from "../models/IBuilding"
import { IUser, UserRole } from "../models/IUser"

export const isSuperAdmin = (user: IUser | null | undefined): boolean => {
    return user?.role === UserRole.SuperAdmin;
}

export const hasOwnerRights = (user: IUser | null | undefined, building: IBuilding): boolean => {
    return user?.role === UserRole.SuperAdmin || (user?.role === UserRole.Admin && building.ownerId === user?.id);
}