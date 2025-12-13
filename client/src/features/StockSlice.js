import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchItems = createAsyncThunk("stock/fetchItems", async () => {
    try {
        const baseUrl = process.env.REACT_APP_API_URL || "https://inventory-server-8obb.onrender.com";
        const response = await axios.get(`${baseUrl}/items`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
});

export const stockSlice = createSlice({
    name: "stock",
    initialState: {
        stockItems: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.stockItems = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export default stockSlice.reducer;
