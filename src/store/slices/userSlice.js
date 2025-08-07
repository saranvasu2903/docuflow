import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  organizationId: null,
  email: null,
  fullName: null,
  role: null,
  imageUrl: null,
  tierid: null,
  permission: [],
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
        tierid,
        permission = [],
      } = action.payload;

      state.userId = userId;
      state.organizationId = organizationId;
      state.email = email;
      state.fullName = fullName;
      state.role = role;
      state.imageUrl = imageUrl;
      state.tierid = tierid;
      state.permission = permission;
    },
    clearUserInfo: (state) => {
      state.userId = null;
      state.organizationId = null;
      state.email = null;
      state.fullName = null;
      state.role = null;
      state.imageUrl = null;
      state.tierid = null;
      state.permission = [];
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
