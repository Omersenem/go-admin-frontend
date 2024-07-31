// ** Redux
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

// ** Types
import { InitialState, Institution } from 'src/types/_example'

const initialState: InitialState = {
  institution: null
}

export const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    storeInstitution: (state, action: PayloadAction<Institution>) => {
      state.institution = action.payload
    }
  }
})

export const { storeInstitution } = exampleSlice.actions

export default exampleSlice.reducer