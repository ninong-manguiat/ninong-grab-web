import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import appSlice from './slice/app.slice';

const store = configureStore({
    reducer: {
        app: appSlice.reducer
    },
    middleware: [...getDefaultMiddleware({immutableCheck: false})]
});

export default store;