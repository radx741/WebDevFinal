import React from "react";
import { Registeration } from "../register/Registeration";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "redux-mock-store";
import reducer from "../../features/UserSlice";

const mockStore = configureStore([]);
const store = mockStore({
    user: {
        isSuccess: false,
        isError: false,
        isLoading: false,
        message: ""
    }
});

test("Match the Register UI snapshot...", () => {
    const { container } = render(
        <Provider store={store}>
            <BrowserRouter>
                <Registeration />
            </BrowserRouter>
        </Provider>
    );
    expect(container).toMatchSnapshot();
});

test("To match the initial state....", () => {
    const expected = {
        user: {},
        message: "",
        isLoading: false,
        isSuccess: false,
        isError: false
    };
    expect(reducer(undefined, { type: undefined })).toEqual(expected);
});

test("checking name input....", () => {
    render(
        <Provider store={store}>
            <BrowserRouter>
                <Registeration />
            </BrowserRouter>
        </Provider>
    );

    const nameInput = screen.getByPlaceholderText(/Enter your Name/i);
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    expect(nameInput.value).toBe("John Doe");
});

test("checking email format....", () => {
    render(
        <Provider store={store}>
            <BrowserRouter>
                <Registeration />
            </BrowserRouter>
        </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your Email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(reg.test(emailInput.value)).toBe(true);
});

test("checking password matching....", () => {
    render(
        <Provider store={store}>
            <BrowserRouter>
                <Registeration />
            </BrowserRouter>
        </Provider>
    );

    const passwordInput = screen.getByPlaceholderText("Enter your Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm your Password");

    fireEvent.change(passwordInput, { target: { value: "Password123!" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "Password123!" } });

    expect(passwordInput.value).toBe(confirmPasswordInput.value);
});
