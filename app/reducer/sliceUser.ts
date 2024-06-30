import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LogInInfo } from "../entities/domains";
import { RootState } from "./store";

const initialState = {
    logIn: {
        logged: false,
        name: "",
        lastName: "",
        secondLastName: "",
        userId: "",
        isAdmin: false, 
    }
}

const sliceLogin = createSlice({
    name: "sliceLogin",
    initialState: initialState,
    reducers: {
        logIn:(state, action: PayloadAction<LogInInfo>) => {
            state.logIn = action.payload.logIn;
        },
        logOut:(state, action) => {
            state = initialState;
        },
    },
});



    export const { logIn, logOut } = sliceLogin.actions;
    export const selectLogIn = (state: any) => state.sliceUserReducer;
    export default sliceLogin.reducer;