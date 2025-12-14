import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://server-noo7.onrender.com/orders';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const addOrder = createAsyncThunk('orders/addOrder', async (orderData) => {
    const response = await axios.post(API_URL, orderData);
    return response.data.order;
});

export const updateOrder = createAsyncThunk('orders/updateOrder', async ({ id, orderData }) => {
    const response = await axios.put(`${API_URL}/${id}`, orderData);
    return response.data.order;
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        status: 'idle',
        error: null,
        canceledCount: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addOrder.fulfilled, (state, action) => {
                state.orders.push(action.payload);
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                const index = state.orders.findIndex((order) => order._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.orders = state.orders.filter((order) => order._id !== action.payload);
                state.canceledCount += 1;
            });
    },
});

export default orderSlice.reducer;
