import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getClients, getEquipments } from "../services/catalogServices";

const initialState = {
    data : null  
}

const sliceEquipment = createSlice({
    name: "sliceEquipment",
    initialState : initialState,
    reducers:{
        getEquipmentReducer: (state) => {
            state.data = getEquipments();
        },
    },
});

export const {getEquipmentReducer} = sliceEquipment.actions;
export default sliceEquipment.reducer;