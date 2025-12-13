import reducer from "../../features/OrderSlice";

test("To match the initial state....", () => {
    const expected = {
        orders: [],
        status: "idle",
        error: null,
        canceledCount: 0
    };
    expect(reducer(undefined, { type: undefined })).toEqual(expected);
});
