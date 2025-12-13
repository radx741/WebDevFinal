import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "redux-mock-store";
import Login from "../login/Login";
import reducer from "../../features/UserSlice";

const myMockStore = configureStore([])
const myStore = myMockStore(
    {
        user: {
            user: null,
            isSuccess: false,
            isError: false,
            isLoading: false
        }
    }
)

// to match UI snapshot
test("Match the Login UI snapshot...", () => {
    const { container } = render(
        <Provider store={myStore}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </Provider>
    )
    screen.debug(container)

    expect(container).toMatchSnapshot()
})


// check the initial state
const myState = {
    user: {},
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: ""
}

test("To match the initial state....", () => {
    expect(reducer(undefined, { type: undefined })).toEqual(myState)
})

test("checking email format....", () => {
    render(
        <Provider store={myStore}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </Provider>
    );

    const emailInput = screen.getByPlaceholderText(/Enter your Email/i)
    fireEvent.change(emailInput, { target: { value: "abc@gmail.com" } });

    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegEx.test(emailInput.value)).toBe(true);
});

test("checking password format....", () => {
    render(
        <Provider store={myStore}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </Provider>
    );

    const passwordInput = screen.getByPlaceholderText(/Enter your Password/i)
    fireEvent.change(passwordInput, { target: { value: "Ibra123@!" } });

    const passwordRegEx = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    expect(passwordRegEx.test(passwordInput.value)).toBe(true);
})
