import { createApi } from '@reduxjs/toolkit/query/react';
import { IDataInputEntry } from '../../models/IDataInputEntry';
import { IBuilding } from '../../models/IBuilding';
import { IUser, UserRole } from '../../models/IUser';
import { ILoginRequest } from '../../models/requests/authentication/ILoginRequest';
import { IRefreshTokenRequest } from '../../models/requests/authentication/IRefreshTokenRequest';
import { IAddSystemRequest } from '../../models/requests/systems/IAddSystemRequest';
import { IDeleteSystemRequest } from '../../models/requests/systems/IDeleteSystemRequest';
import { IUpdateSystemRequest } from '../../models/requests/systems/IUpdateSystemRequest';
import { IUpdateBuildingDiagramImageRequest } from '../../models/requests/buildings/IUpdateBuildingDiagramImageRequest';
import { IUpdateBuildingDiagramNodesRequest } from '../../models/requests/buildings/IUpdateBuildingDiagramNodesRequest';
import { IUpdateBuildingRequest } from '../../models/requests/buildings/IUpdateBuildingRequest';
import { ISignalRSubscribeAllRequest } from '../../models/requests/signalr/ISignalRSubscribeAllRequest';
import { ISignalRSubscribeRequest } from '../../models/requests/signalr/ISignalRSubscribeRequest';
import { ISignalRUnsubscribeRequest } from '../../models/requests/signalr/ISignalRUnsubscribeRequest';
import { IAddUserRequest } from '../../models/requests/users/IAddUsersRequest';
import { IUpdateUserRequest } from '../../models/requests/users/IUpdateUserRequest';
import { ILoginResponse } from '../../models/responses/authentication/ILoginResponse';
import { IRefreshTokenResponse } from '../../models/responses/authentication/IRefreshTokenResponse';
import { IAddSystemResponse } from '../../models/responses/systems/IAddSystemResponse';
import { IGetHistoricDataResponse } from '../../models/responses/data/IGetHistoricDataResponse';
import { IGetPredictionDataResponse } from '../../models/responses/data/IGetPredictionDataResponse';
import { IAddBuildingResponse } from '../../models/responses/buildings/IAddBuildingResponse';
import { IUpdateBuildingDiagramImageResponse } from '../../models/responses/buildings/IUpdateBuildingDiagramImageResponse';
import { IAddUserResponse } from '../../models/responses/users/IAddUserResponse';
import { IGetAllUsersResponse } from '../../models/responses/users/IGetAllUsersResponse';
import { baseQueryWithReauth } from './baseQueryWithReauth';
import { IAddNeighborhoodRequest } from '../../models/requests/neighborhoods/IAddNeighborhoodRequest';
import { IUpdateNeighborhoodRequest } from '../../models/requests/neighborhoods/IUpdateNeighborhoodRequest';
import { IAddNeighborhoodResponse } from '../../models/responses/neighborhoods/IAddNeighborhoodResponse';
import { INeighborhood } from '../../models/INeighborhood';
import { IGetAllNeighborhoodsResponse } from '../../models/responses/neighborhoods/IGetAllNeighborhoodsResponse';
import { IAddBuildingRequest } from '../../models/requests/buildings/IAddBuildingRequest';
import { IGetBuildingSystemsResponse } from '../../models/responses/systems/IGetBuildingSystemsResponse';
import { IUpdateBuildingScheduleRequest } from '../../models/requests/buildings/IUpdateBuildingScheduleRequest';
import { ITimestampedValue } from '../../models/signalr/INewDataMessage';
import { IGetElectricityPricesResponse } from '../../models/responses/data/IGetElectricityPricesResponse';
import { IGetAllNeighborhoodBuildingsResponse } from '../../models/responses/neighborhoods/IGetAllNeighborhoodBuildingsResponse';
import { IPublishBidRequest } from '../../models/requests/blockchain/IPublishBidRequest';
import { IPublishAskRequest } from '../../models/requests/blockchain/IPublishAskRequest';
import { IGetTransactionsResponse } from '../../models/responses/blockchain/IGetTransactionsResponse';
import { IGetOrderbookResponse } from '../../models/responses/blockchain/IGetOrderbookResponse';
import { IOrderbookEntry } from '../../models/IOrderbookEntry';
import { IBlockchainTransaction } from '../../models/IBlockchainTransaction';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Neighborhood', 'Building', 'System', 'User'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<ILoginResponse, ILoginRequest>({
      query: (requestData) => ({
        url: '/auth/login',
        method: 'POST',
        body: requestData,
      }),
    }),
    refreshToken: builder.mutation<IRefreshTokenResponse, IRefreshTokenRequest>({
      query: (requestData) => ({
        url: '/auth/refreshtoken',
        method: 'POST',
        body: requestData,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    // Users
    addUser: builder.mutation<IAddUserResponse, IAddUserRequest>({
      query: (requestData) => ({
        url: '/users',
        method: 'POST',
        body: requestData,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation<void, { userId: string; updateUser: IUpdateUserRequest }>({
      query: (requestData) => ({
        url: `/users/${requestData.userId}`,
        method: 'PUT',
        body: requestData.updateUser,
      }),
      invalidatesTags: ['User'],
    }),
    getAllUsers: builder.query<IUser[], void>({
      query: () => '/users',
      transformResponse: (response: IGetAllUsersResponse) => response.data,
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: 'User' as const, id })), 'User'] : ['User'],
    }),
    getAllUsersByRole: builder.query<IUser[], { role: UserRole }>({
      query: (args) => `/users?role=${args.role}`,
      transformResponse: (response: IGetAllUsersResponse) => response.data,
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: 'User' as const, id })), 'User'] : ['User'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    // Neighborhoods
    getAllNeighborhoods: builder.query<INeighborhood[], void>({
      query: () => '/neighborhoods',
      transformResponse: (response: IGetAllNeighborhoodsResponse) => response.data,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Neighborhood' as const, id })), 'Neighborhood']
          : ['Neighborhood'],
    }),
    getAllNeighborhoodBuildings: builder.query<IBuilding[], { neighborhoodId: string }>({
      query: (requestData) => `/neighborhoods/${requestData.neighborhoodId}/buildings`,
      transformResponse: (response: IGetAllNeighborhoodBuildingsResponse) => response.data,
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: 'Building' as const, id })), 'Building'] : ['Building'],
    }),
    addNeighborhood: builder.mutation<IAddNeighborhoodResponse, IAddNeighborhoodRequest>({
      query: (requestData) => ({
        url: '/neighborhoods',
        method: 'POST',
        body: requestData,
      }),
      invalidatesTags: ['Neighborhood'],
    }),
    updateNeighborhood: builder.mutation<
      void,
      { neighborhoodId: string; updateNeighborhood: IUpdateNeighborhoodRequest }
    >({
      query: (requestData) => ({
        url: `/neighborhoods/${requestData.neighborhoodId}`,
        method: 'PUT',
        body: requestData.updateNeighborhood,
      }),
      invalidatesTags: ['Neighborhood'],
    }),
    deleteNeighborhood: builder.mutation<void, { neighborhoodId: string }>({
      query: (requestData) => ({
        method: 'DELETE',
        url: `/neighborhoods/${requestData.neighborhoodId}`,
      }),
      invalidatesTags: ['Neighborhood'],
    }),
    // Buildings
    addBuilding: builder.mutation<IAddBuildingResponse, { neighborhoodId: string; request: IAddBuildingRequest }>({
      query: (requestData) => ({
        url: `/neighborhoods/${requestData.neighborhoodId}/buildings`,
        method: 'POST',
        body: requestData.request,
      }),
      invalidatesTags: ['Building'],
    }),
    updateBuilding: builder.mutation<
      void,
      { buildingId: string; neighborhoodId: string; updateBuilding: IUpdateBuildingRequest }
    >({
      query: (requestData) => ({
        url: `/neighborhoods/${requestData.neighborhoodId}/buildings/${requestData.buildingId}`,
        method: 'PUT',
        body: requestData.updateBuilding,
      }),
      invalidatesTags: ['Building'],
    }),
    updateBuildingSchedule: builder.mutation<
      void,
      { buildingId: string; neighborhoodId: string; updateBuildingSchedule: IUpdateBuildingScheduleRequest }
    >({
      query: (requestData) => ({
        url: `/neighborhoods/${requestData.neighborhoodId}/buildings/${requestData.buildingId}/schedule`,
        method: 'PUT',
        body: requestData.updateBuildingSchedule,
      }),
      invalidatesTags: ['Building'],
    }),
    updateBuildingDiagramImage: builder.mutation<
      IUpdateBuildingDiagramImageResponse,
      { buildingId: string; neighborhoodId: string; updateBuildingDiagramImage: IUpdateBuildingDiagramImageRequest }
    >({
      query: (requestData) => ({
        url: `/neighborhoods/${requestData.neighborhoodId}/buildings/${requestData.buildingId}/diagram/image`,
        method: 'PUT',
        body: requestData.updateBuildingDiagramImage,
      }),
      invalidatesTags: ['Building'],
    }),
    updateBuildingDiagramNodes: builder.mutation<
      void,
      { buildingId: string; neighborhoodId: string; updateBuildingDiagramNodes: IUpdateBuildingDiagramNodesRequest }
    >({
      query: (requestData) => ({
        url: `/neighborhoods/${requestData.neighborhoodId}/buildings/${requestData.buildingId}/diagram/nodes`,
        method: 'PUT',
        body: requestData.updateBuildingDiagramNodes,
      }),
      invalidatesTags: ['Building'],
    }),
    deleteBuilding: builder.mutation<void, { buildingId: string; neighborhoodId: string }>({
      query: (requestData) => ({
        method: 'DELETE',
        url: `/neighborhoods/${requestData.neighborhoodId}/buildings/${requestData.buildingId}`,
      }),
      invalidatesTags: ['Building'],
    }),
    // Systems
    addSystem: builder.mutation<IAddSystemResponse, IAddSystemRequest>({
      query: (requestData) => ({
        url: '/systems',
        method: 'POST',
        body: requestData,
      }),
      invalidatesTags: ['System'],
    }),
    getBuildingSystems: builder.query({
      query: ({ neighborhoodId, buildingId }) => `/neighborhoods/${neighborhoodId}/buildings/${buildingId}/systems`,
      transformResponse: (response: IGetBuildingSystemsResponse) => response.data,
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: 'System' as const, id })), 'System'] : ['System'],
    }),
    updateSystem: builder.mutation<void, { systemId: string; updateSystem: IUpdateSystemRequest }>({
      query: (requestData) => ({
        url: `/systems/${requestData.systemId}`,
        method: 'PUT',
        body: requestData.updateSystem,
      }),
      invalidatesTags: ['System'],
    }),
    deleteSystem: builder.mutation<void, { systemId: string; deleteSystem: IDeleteSystemRequest }>({
      query: (requestData) => ({
        url: `/systems/${requestData.systemId}`,
        method: 'DELETE',
        body: requestData,
      }),
      invalidatesTags: ['System'],
    }),
    // Data
    getElectricityPrices: builder.query<ITimestampedValue[], { fromDate?: string; toDate?: string }>({
      query: (requestData) => {
        const { fromDate, toDate } = requestData;
        return {
          url: `/electricity/prices`,
          params: { fromDate, toDate },
        };
      },
      transformResponse: (response: IGetElectricityPricesResponse) => response.data,
    }),
    getHistoricData: builder.query<
      IDataInputEntry[],
      {
        buildingId: string;
        neighborhoodId: string;
        systemId: string;
        dataId: string;
        fromDate?: number | null;
        toDate?: number | null;
      }
    >({
      query: (requestData) => {
        const { fromDate, toDate } = requestData;
        return {
          url: `neighborhoods/${requestData.neighborhoodId}/buildings/${requestData.buildingId}/systems/${requestData.systemId}/${requestData.dataId}/history`,
          params: { fromDate, toDate },
        };
      },
      transformResponse: (response: IGetHistoricDataResponse) => response.data,
    }),
    getPredictionData: builder.query<
      IDataInputEntry[],
      {
        buildingId: string;
        neighborhoodId: string;
        systemId: string;
        dataId: string;
        fromDate?: number | null;
        toDate?: number | null;
      }
    >({
      query: (requestData) => {
        const { fromDate, toDate } = requestData;
        return {
          url: `neighborhoods/${requestData.neighborhoodId}/buildings/${requestData.buildingId}/systems/${requestData.systemId}/${requestData.dataId}/prediction`,
          params: { fromDate, toDate },
        };
      },
      transformResponse: (response: IGetPredictionDataResponse) => response.data,
    }),
    // SignalR
    subscribe: builder.mutation<void, ISignalRSubscribeRequest>({
      query: (requestData) => ({
        url: '/signalr/subscribe',
        method: 'POST',
        body: requestData,
      }),
    }),
    subscribeAll: builder.mutation<void, ISignalRSubscribeAllRequest>({
      query: (requestData) => ({
        url: '/signalr/subscribeall',
        method: 'POST',
        body: requestData,
      }),
    }),
    unsubscribe: builder.mutation<void, ISignalRUnsubscribeRequest>({
      query: (requestData) => ({
        url: '/signalr/unsubscribe',
        method: 'POST',
        body: requestData,
      }),
    }),
    // Blockchain
    getOrderbook: builder.query<IOrderbookEntry[], void>({
      query: () => ({
        url: '/blockchain/orderbook',
        method: 'GET',
      }),
      transformResponse: (response: IGetOrderbookResponse) => response.data,
    }),
    getTransactions: builder.query<IBlockchainTransaction[], void>({
      query: () => ({
        url: '/blockchain/transactions',
        method: 'GET',
      }),
      transformResponse: (response: IGetTransactionsResponse) => response.data,
    }),
    publishBid: builder.mutation<void, IPublishBidRequest>({
      query: (requestData) => ({
        url: '/blockchain/actions/bid',
        method: 'POST',
        body: requestData,
      }),
    }),
    publishAsk: builder.mutation<void, IPublishAskRequest>({
      query: (requestData) => ({
        url: '/blockchain/actions/ask',
        method: 'POST',
        body: requestData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,

  useAddUserMutation,
  useUpdateUserMutation,
  useGetAllUsersQuery,
  useGetAllUsersByRoleQuery,
  useDeleteUserMutation,

  useGetAllNeighborhoodsQuery,
  useGetAllNeighborhoodBuildingsQuery,
  useAddNeighborhoodMutation,
  useUpdateNeighborhoodMutation,
  useDeleteNeighborhoodMutation,

  useAddBuildingMutation,
  useUpdateBuildingMutation,
  useUpdateBuildingScheduleMutation,
  useUpdateBuildingDiagramImageMutation,
  useUpdateBuildingDiagramNodesMutation,
  useDeleteBuildingMutation,

  useAddSystemMutation,
  useUpdateSystemMutation,
  useGetBuildingSystemsQuery,
  useDeleteSystemMutation,

  useGetElectricityPricesQuery,
  useGetHistoricDataQuery,
  useLazyGetHistoricDataQuery,
  useGetPredictionDataQuery,
  useLazyGetPredictionDataQuery,

  useSubscribeMutation,
  useSubscribeAllMutation,
  useUnsubscribeMutation,

  useGetOrderbookQuery,
  useGetTransactionsQuery,
  usePublishBidMutation,
  usePublishAskMutation,
} = apiSlice;
