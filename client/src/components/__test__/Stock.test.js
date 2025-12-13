import reducer from "../../features/StockSlice";

test("To match the initial state....", () => {
    const expected = {
        stockItems: [],
        status: "idle",
        error: null
    };
    expect(reducer(undefined, { type: undefined })).toEqual(expected);
});
