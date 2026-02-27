import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { authApi } from "../services/authApi";
import { freelancerApi } from "../services/freelancerApi";
import { userApi } from "../services/userApi";
import { freelancerPostApi } from "../services/freelancerPostApi";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [freelancerApi.reducerPath]: freelancerApi.reducer,
    [freelancerPostApi.reducerPath]: freelancerPostApi.reducer,
     [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(
          authApi.middleware,
          freelancerApi.middleware, 
          freelancerPostApi.middleware,
          userApi.middleware,
        ),
});