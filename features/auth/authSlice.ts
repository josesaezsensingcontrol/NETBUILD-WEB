import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { getInitials } from '../../helpers/UserExtensions';
import { ITokensData } from '../../models/ITokensData';
import { IUser } from '../../models/IUser'
import { jwtDecode } from "jwt-decode";
import { INetBuildJwtPayload } from '../../models/INetBuildJwtPayload';

type AuthState = {
    user: IUser | null | undefined;
    accessToken: string | null;
    refreshToken: string | null;
}

const sessionStorageKey: string = "tpk";
const getAuthUser: () => IUser | null = () => {
    const value: string | null = sessionStorage.getItem(sessionStorageKey);
    if (value === null) {
        return null;
    }

    const keys: ITokensData = JSON.parse(value);
    const payload: INetBuildJwtPayload = jwtDecode<INetBuildJwtPayload>(keys.accessToken);
    return {
        email: payload.email,
        id: payload.sid,
        firstName: payload.given_name,
        lastName: payload.family_name,
        initials: getInitials(payload.given_name, payload.family_name),
        role: parseInt(payload.role)
    };
}

const getAccessToken: () => string | null = () => {
    const value: string | null = sessionStorage.getItem(sessionStorageKey);
    if (value === null) {
        return null;
    }

    const keys: ITokensData = JSON.parse(value);
    if (keys.accessToken === null) {
        return null;
    }

    return keys.accessToken;
}

const getRefreshToken: () => string | null = () => {
    const value = sessionStorage.getItem(sessionStorageKey);
    if (value === null) {
        return null;
    }

    const keys: ITokensData = JSON.parse(value);

    return keys.refreshToken;
}

const initialState: AuthState = {
    user: getAuthUser(),
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken()
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setCredentials: (state, { payload }: PayloadAction<ITokensData>
        ) => {
            sessionStorage.setItem(sessionStorageKey, JSON.stringify(payload));
            state.user = getAuthUser();
            state.accessToken = getAccessToken();
            state.refreshToken = getRefreshToken();
        },
        tokenReceived: (state, { payload }: PayloadAction<ITokensData>) => {
            sessionStorage.setItem(sessionStorageKey, JSON.stringify(payload));
            state.user = getAuthUser();
            state.accessToken = getAccessToken();
            state.refreshToken = getRefreshToken();
        },
        profileChanged: (state, { payload }: PayloadAction<{ firstName: string, lastName: string, email: string }>) => {
            if (state.user) {
                state.user.firstName = payload.firstName;
                state.user.lastName = payload.lastName;
                state.user.email = payload.email;
                state.user.initials = getInitials(payload.firstName, payload.lastName);
            }
        },
        localLogout: (state) => {
            sessionStorage.clear();
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
        }
    },
})

export const { setCredentials, tokenReceived, profileChanged, localLogout } = slice.actions

export default slice.reducer

export const selectCurrentUser = (state: RootState) => state.auth.user
