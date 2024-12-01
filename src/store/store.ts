import { configureStore } from "@reduxjs/toolkit";
import alphabetReducer from "./alphabetSlice";

export const store = configureStore({
  reducer: {
    alphabet: alphabetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
