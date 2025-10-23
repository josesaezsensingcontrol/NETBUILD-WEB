import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'

type BuildingsState = {
  selectedBuildingId: string | null | undefined;
}

const initialState: BuildingsState = {
  selectedBuildingId: null
}

const buildingsSlice = createSlice({
  name: 'buildings',
  initialState: initialState,
  reducers: {
    setSelectedBuildingId: (state, { payload }: PayloadAction<string | null | undefined>
    ) => {
      state.selectedBuildingId = payload;
    }
  }
})

export const selectCurrentBuildingId = (state: RootState) => state.buildings.selectedBuildingId
export const { setSelectedBuildingId } = buildingsSlice.actions

export default buildingsSlice.reducer