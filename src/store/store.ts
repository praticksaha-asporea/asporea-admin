import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth.store";

export const store = configureStore({
  reducer: {
    authSlice: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
