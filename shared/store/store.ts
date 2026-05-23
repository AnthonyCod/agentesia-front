import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from '@/shared/api/baseApi'
import authReducer, { saveAuthState } from '@/features/auth/store/authSlice'
import catalogReducer from '@/features/catalog/store/catalogSlice'
import conversationsReducer from '@/features/conversations/store/conversationsSlice'
import ordersReducer from '@/features/orders/store/ordersSlice'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    catalog: catalogReducer,
    conversations: conversationsReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

let prevAuth = store.getState().auth
store.subscribe(() => {
  const nextAuth = store.getState().auth
  if (nextAuth !== prevAuth) {
    prevAuth = nextAuth
    saveAuthState(nextAuth)
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
