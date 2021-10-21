import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialOrder = {
    name: "",
    preparation_time: "00:00:00",
    type: ''
}

export const sendRequest =  createAsyncThunk('sendRequest', async (_, {getState}) => {
    const resp = await fetch('https://frosty-wood-6558.getsandbox.com/dishes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(getState().order)
    });
    if (!resp.ok){
        const [mess] = Object.entries(await resp.json());
        let err = `${mess[0].toUpperCase()}: ${mess[1]}`;
        switch(resp.status){
            case 400: err = 'Bad request! ' + err; break;
            // ...
            default: err = `${resp.status} ${resp.statusText} ` + err;
        }
        throw new Error(`Error... ${err}`);
    }
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