import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { apiSlice } from '../api/apiSlice';

type NeighborhoodsState = {
    selectedNeighborhoodId: string | null | undefined;
}

const initialState: NeighborhoodsState = {
    selectedNeighborhoodId: null
}

const neighborhoodsSlice = createSlice({
    name: 'neighborhoods',
    initialState: initialState,
    reducers: {
        setSelectedNeighborhood: (state, { payload }: PayloadAction<string | null | undefined>
        ) => {
            state.selectedNeighborhoodId = payload;
        }
    }
})

export const selectAllNeighborhoods = createSelector(
    apiSlice.endpoints.getAllNeighborhoods.select(),
    neighborhoodsResult => neighborhoodsResult.data ?? []
)

export const selectCurrentNeighborhood = createSelector(
    selectAllNeighborhoods,
    (state: RootState) => state.neighborhoods.selectedNeighborhoodId,
    (neighborhoods, neighborhoodId) => neighborhoods.find(neighborhood => neighborhood.id === neighborhoodId)
)

export const { setSelectedNeighborhood } = neighborhoodsSlice.actions

export default neighborhoodsSlice.reducer
