import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { authApi } from "../services/authApi";
import { freelancerApi } from "../services/freelancerApi";
import { userApi } from "../services/userApi";
import { freelancerPostApi } from "../services/freelancerPostApi";
import favoritesReducer from "../features/favorites/favoritesSlice";
import { profileApi } from "../services/profileApi";
import { serviceApi } from "../services/servicesApi";
import { categoriesApi } from "../services/categoriesApi";
import { apiSlice } from "../services/apiSlice";
import { detailworkApi } from "../services/detailworkApi";
import { jobsApi } from "../services/JobsApi";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    [authApi.reducerPath]: authApi.reducer,
    [freelancerApi.reducerPath]: freelancerApi.reducer,
    [freelancerPostApi.reducerPath]: freelancerPostApi.reducer,
     [userApi.reducerPath]: userApi.reducer,
     [profileApi.reducerPath]: profileApi.reducer,
     [serviceApi.reducerPath]: serviceApi.reducer,
     [categoriesApi.reducerPath]: categoriesApi.reducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
      [jobsApi.reducerPath]: jobsApi.reducer,
      
    
      [detailworkApi.reducerPath]: detailworkApi.reducer,
      
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(
          authApi.middleware,
          freelancerApi.middleware, 
          freelancerPostApi.middleware,
          userApi.middleware,
          profileApi.middleware,
          serviceApi.middleware,
          categoriesApi.middleware,
          apiSlice.middleware,
          jobsApi.middleware,
        )
        .concat(detailworkApi.middleware), 
});