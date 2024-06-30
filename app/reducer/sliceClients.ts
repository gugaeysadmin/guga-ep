import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getClients } from "../services/catalogServices";


const initialState = {
    data : null  
}

const sliceClient = createSlice({
    name: "sliceClient",
    initialState : initialState,
    reducers:{
        getClientsReducer: (state) => {
            getClients().then((data) => {
                state.data = data;
            })
        },
    },
});

export const {getClientsReducer} = sliceClient.actions;
export default sliceClient.reducer;