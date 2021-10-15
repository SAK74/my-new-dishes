import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialOrder = {
    name: "",
    preparationTime: "00:00:00",
    typeOfDish: ''
}

export const sendRequest =  createAsyncThunk('sendRequest', async (_, {getState}) => {
    const resp = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(getState().order)
    });
    if (!resp.ok) throw new Error(`error... ${resp.url} status: ${resp.status} ${resp.statusText}`)
    return resp.json();
});

const disherSlice = createSlice({
    name: 'dishes',
    initialState:{
        order: initialOrder,
        status: 'iddle',
        error: null,
        sendedOrders: []
    },
    reducers:{
        addOrder: (state, action) => {
            state.order = action.payload;
            state.status = 'iddle';
        },
    },
    extraReducers:{
        [sendRequest.fulfilled]: (state, action) => {
            state.status = 'complete';
            state.sendedOrders.push(action.payload);
        },
        [sendRequest.pending]: (state) => {state.status = 'pending'},
        [sendRequest.rejected]: (state, action) => {
            state.status = 'error';
            state.error = action.error.message;
        }
    }
});
export const {addOrder} = disherSlice.actions;
export default configureStore({reducer: disherSlice.reducer});