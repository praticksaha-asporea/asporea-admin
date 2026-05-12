 
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      // console.log(action,6666);
      
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