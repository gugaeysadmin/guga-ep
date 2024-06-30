import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LogInInfo } from "../entities/domains";
import { RootState } from "./store";

const initialState = {
    section: 1
}

const sliceSection = createSlice({
    name: "sliceSection",
    initialState: initialState,
    reducers: {
        changeSection:(state, action: PayloadAction<number>) => {
            state.section = action.payload;
        }
    },
});

export const {changeSection} = sliceSection.actions;
export const selectSection = (state: any) => state.sliceSectionReducer;
export default sliceSection.reducer;