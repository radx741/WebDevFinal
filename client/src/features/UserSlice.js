import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for login
export const getUser = createAsyncThunk("users/getUser", async (udata, { rejectWithValue }) => {
  try {
    const baseUrl =  "https://server-noo7.onrender.com";
    const response = await axios.post(`${baseUrl}/login`, udata);
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.message || error.message || "Login failed"
    );
  }
}
);

export const addUser = createAsyncThunk("users/addUser", async (udata, { rejectWithValue }) => {
  try {
    const baseUrl = "https://server-noo7.onrender.com";
    const response = await axios.post(`${baseUrl}/register`, udata);
    return response.data;
  } catch (error) {
    return rejectWithValue(
      error.response?.data?.message || error.message || "Registration failed"
    );
  }
}
);

// Load user from localStorage if available
const getUserFromLocalStorage = () => {
  try {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {};
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    return {};
  }
};

const initialState = {
  user: getUserFromLocalStorage(),
  message: "",
  isLoading: false,
  isSuccess: false,
  isError: false,
};

const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetUserState: (state) => {
      // Only reset flags, NOT user data (to preserve session persistence)
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      // DO NOT clear user or localStorage here
    },
    logoutUser: (state) => {
      state.user = {};
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
      // Clear user from localStorage
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.message = action.payload.message || "Login successful";
        // Save user to localStorage
        try {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        } catch (error) {
          console.error('Error saving user to localStorage:', error);
        }
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.user = {};
        state.message = action.payload || "Invalid email or password";
      })
      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message || "Registration successful";
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Registration failed";
      });
  },
});

export const { resetUserState, logoutUser } = UserSlice.actions;
export default UserSlice.reducer;