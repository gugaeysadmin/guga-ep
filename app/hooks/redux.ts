import { UseDispatch, TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../reducer/store";
import { useDateField } from "@mui/x-date-pickers/DateField/useDateField";

export const useAppDispatch  = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;