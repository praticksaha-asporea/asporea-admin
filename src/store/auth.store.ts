 
import { createSlice } from "@reduxjs/toolkit";
import type { IUser } from "../interfaces/itable";
interface AuthState {
  isLoggedIn: boolean;
  user: IUser | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },

    logOut: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, logOut } = authSlice.actions;
export default authSlice.reducer;