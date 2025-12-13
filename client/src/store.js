import { configureStore } from "@reduxjs/toolkit";
import UserReducer from './features/UserSlice';
import stockReducer from './features/StockSlice';
import OrderReducer from './features/OrderSlice';

export const store = configureStore({
    reducer: {
        user: UserReducer,
        stock: stockReducer,
        orders: OrderReducer,
    },
});