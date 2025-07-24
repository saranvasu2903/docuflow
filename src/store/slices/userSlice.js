// src/store/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  organizationId: null,
  email: null,
  fullName: null,
  role: null,
  imageUrl: null,
  tierid :null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      const {
        userId,
        organizationId,
        email,
        fullName,
        role,
        imageUrl,
        tierid
      } = action.payload;
      state.userId = userId;
      state.organizationId = organizationId;
      state.email = email;
      state.fullName = fullName;
      state.role = role;
      state.imageUrl = imageUrl;
      state.tierid = tierid
    },
    clearUserInfo: (state) => {
      state.userId = null;
      state.organizationId = null;
      state.email = null;
      state.fullName = null;
      state.role = null;
      state.imageUrl = null;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
