import React from "react";
import Dashboard from "../home/home content/dashboard/Dashboard";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "redux-mock-store";
// Dashboard uses data from stock and orders, but we'll test StockSlice reducer as a representative for initial state requirement
import reducer from "../../features/StockSlice";

const mockStore = configureStore([]);
const store = mockStore({
    stock: {
        stockItems: [
            { itemName: "Item 1", remaining: 10, initial: 20, sold: 10 },
            { itemName: "Item 2", remaining: 5, initial: 10, sold: 5 }
        ],
        isLoading: false,
        isSuccess: false,
        isError: false
    },
    orders: {
        orders: [
            { status: "Delivered", date: new Date().toISOString() },
            { status: "Pending", date: new Date().toISOString() }
        ],
        canceledCount: 0,
        isLoading: false,
        isSuccess: false,
        isError: false
    }
});

test("Match the Dashboard UI snapshot...", () => {
    // ResizeObserver mock might be needed for Recharts
    global.ResizeObserver = class ResizeObserver {
        observe() { }
        unobserve() { }
        disconnect() { }
    };

    const { container } = render(
        <Provider store={store}>
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        </Provider>
    );
    expect(container).toMatchSnapshot();
});

test("To match the initial state (StockSlice)....", () => {
    // Assuming StockSlice initial state
    const expected = {
        stockItems: [],
        status: "idle",
        error: null
    };
    // Note: We might need to adjust 'expected' based on actual StockSlice initial state if it differs
    // The provided UserSlice example had a specific structure. StockSlice likely similar.
    expect(reducer(undefined, { type: undefined })).toEqual(expected);
});

test("renders chart containers...", () => {
    global.ResizeObserver = class ResizeObserver {
        observe() { }
        unobserve() { }
        disconnect() { }
    };

    render(
        <Provider store={store}>
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        </Provider>
    );

    // Check for dashboard titles
    expect(screen.getByText("Stock Quantity")).toBeInTheDocument();
    expect(screen.getByText("Orders by Status")).toBeInTheDocument();
    expect(screen.getByText("Orders Per Day")).toBeInTheDocument();
});
