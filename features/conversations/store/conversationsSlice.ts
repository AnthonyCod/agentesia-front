import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ConversationsState {
  search: string
}

const initialState: ConversationsState = {
  search: '',
}

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
    },
  },
})

export const { setSearch } = conversationsSlice.actions
export default conversationsSlice.reducer
