import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { cotizationGeneralData } from "../entities/cotization";

const initialState = {
    data : null  
}

const sliceCurrentCotization = createSlice({
    name: "sliceCurrentCotization",
    initialState : initialState,
    reducers:{
        setCurrentCotization: (state, action: PayloadAction<cotizationGeneralData>) => {
            state.data = action.payload;
        },
        resetCurrentCotization: (state) => {
            state.data = null;
        }
    },
});

export const {setCurrentCotization, resetCurrentCotization} = sliceCurrentCotization.actions;
export default sliceCurrentCotization.reducer;