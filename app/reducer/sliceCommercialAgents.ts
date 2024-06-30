import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getCommercialAgents } from "../services/catalogServices";

const initialState = {
    data : null  
}

const sliceCommertialAgent = createSlice({
    name: "sliceCommertialAgent",
    initialState : initialState,
    reducers:{
        getCommertialAgentReducer: (state) => {
            state.data = getCommercialAgents();
        },
    },
});

export const {getCommertialAgentReducer} = sliceCommertialAgent.actions;
export default sliceCommertialAgent.reducer;