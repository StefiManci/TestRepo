import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  userName: null,
  userRole: null,
  userId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.userName = action.payload.userName;
      state.userRole = action.payload.userRole;
      state.userId = action.payload.userId;
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      localStorage.setItem("username", JSON.stringify(action.payload.userName));
      localStorage.setItem("role", JSON.stringify(action.payload.userRole));
      localStorage.setItem("userid", JSON.stringify(action.payload.userId));
    },
    logout: (state) => {
      state.token = null;
      state.userName = null;
      state.userRole = null;
      state.userId = null;
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("userid");
    },
    loadUser: (state) => {
      const savedUser = localStorage.getItem("token");
      const savedUsername = localStorage.getItem("username");
      const savedRole = localStorage.getItem("role");
      const savedUserId = localStorage.getItem("userid");
      if (savedUser) state.token = JSON.parse(savedUser);
      if (savedUsername) state.userName = JSON.parse(savedUsername);
      if (savedRole) state.userRole = JSON.parse(savedRole);
      if (savedUserId) state.userId = JSON.parse(savedUserId);
    },
  },
});

export const { login, logout, loadUser } = authSlice.actions;
export default authSlice.reducer;
