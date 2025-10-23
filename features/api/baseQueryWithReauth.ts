import {
    BaseQueryFn,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import { authHeaderName, baseUrl } from '../../app.config'
import { RootState } from '../../app/store'
import { IRefreshTokenRequest } from '../../models/requests/authentication/IRefreshTokenRequest'
import { IRefreshTokenResponse } from '../../models/responses/authentication/IRefreshTokenResponse'
import { localLogout, tokenReceived } from '../auth/authSlice'
import { apiSlice } from './apiSlice'

const mutex = new Mutex()
const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;

        if (token) {
            headers.set(authHeaderName, `Bearer ${token}`);
        }

        return headers;
    }
})

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock()

    let result = await baseQuery(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire()

            try {
                const userId = (api.getState() as RootState).auth.user?.id;
                const refreshToken = (api.getState() as RootState).auth.refreshToken;
                const refreshResult = await baseQuery(
                    { url: '/auth/refreshToken', method: "POST", body: { userId, refreshToken } as IRefreshTokenRequest },
                    api,
                    extraOptions
                )

                const tokensResponse = refreshResult.data as IRefreshTokenResponse;
                if (tokensResponse) {
                    api.dispatch(tokenReceived(tokensResponse.data));
                    // retry the initial query
                    result = await baseQuery(args, api, extraOptions)
                } else {
                    api.dispatch(localLogout());
                    api.dispatch(apiSlice.util.resetApiState());
                }
            } finally {
                release()
            }
        } else {
            await mutex.waitForUnlock()
            result = await baseQuery(args, api, extraOptions)
        }
    }

    return result
}