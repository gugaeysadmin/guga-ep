  'use client'
import {    styled, 
            Theme, 
            tableCellClasses, 
            DrawerClasses,
            TableCell,
            TableRow,
            TextField,
            Button,
            ButtonProps,
            Drawer,
            InputBase,
            alpha,
            withStyles,
} from "@mui/material";

import {    colorText,
            colorTextBlack,
            colorDrawer,
            colorTextWhite,
            sidebarColor,
            blueDark,
            blueLight,
            blueLightHover,
            blueUltraDark,
            blueGrey,
} from "../general";
import { DataGrid } from "@mui/x-data-grid";
import { blue } from "@mui/material/colors";
import { BorderColor } from "@mui/icons-material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#0e1a25',
      color: theme.palette.common.white,
      fontSize: 12,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
    }
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: '#5F798F',
    },
    '&:nth-of-type(even)': {
      backgroundColor: '#A7C2DB',
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
    input: {
        color: colorTextWhite,
    },
    '& .MuiInput-input': {
      color: "white",
    },
    '& label.Mui-focused': {
        color: colorTextWhite,
    },
    '& .MuiInput-underline:before': {
        borderBottomColor:'#5F798F',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: colorTextWhite,
    },
    '& .MuiInput-underline:hover:before': {
        //borderBottomColor: '#B4C2CF',
        borderBottomColor: '#c1cad4',
    },
    '& .MuiOutlinedInput-root': {
        color: colorTextWhite,
        '& fieldset': {
            borderColor: '#5F798F',
        },
        '&:hover fieldset':{
            borderColor: '#B4C2CF',
        },
        '&.Mui-focused fieldset': {
            borderColor: colorTextWhite,
        },
    },
    "& .MuiInput-inputAdornedEnd": {
            color: colorTextWhite
        },
        "& .MuiInputAdornment-outlined": {
            color: colorTextWhite
        },
        "& .MuiInputAdornment-positionEnd": {
          color: colorTextWhite
        },
      "& .MuiInputAdornment-root": {
        color: colorTextWhite,
      }
}));
  
export const StyledButton = styled(Button)(({ theme }) => ({
    color: colorTextWhite,
    shape:{
        borderRadius: 20,
    },
    "&.MuiButton-contained": {
        backgroundColor: blueLightHover,
        borderRadius: 8,
    },
    '&:hover': {
      backgroundColor: blueLight,
    },
    '&:disabled':{
      backgroundColor: blueGrey,
    }
}));


export const ActionStyledButton = styled(Button)(({ theme }) => ({
  color: blueLightHover,
  borderWidth: 2,
  borderColor: blueLightHover,
  "&.MuiButton-outlined": {
      backgroundColor: theme.palette.common.white,
      borderRadius: 8,
      //borderWidth: 5,
      borderColor: blueLight
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:disabled':{
    backgroundColor: "grey",
  }
}));

export const StyledCancelButton = styled(Button)(({ theme }) => ({
    color: colorTextBlack,
    shape:{
        borderRadius: 20,
    },
    "&.MuiButton-contained": {
        backgroundColor: '#D85E8D',
        borderRadius: 12,
    },
    '&:hover': {
      backgroundColor: '#FA83B1',
    },
}));

export const StyledSuccessButton = styled(Button)(({ theme }) => ({
    color: colorTextBlack,
    shape:{
        borderRadius: 20,
    },
    "&.MuiButton-contained": {
        backgroundColor: '#85C7B7',
        borderRadius: 12,
    },
    '&:hover': {
      backgroundColor: '#B6D4E6',
    },
}));

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paperAnchorRight': { 
        boxSizing: 'border-box',
        width: 430,
        backgroundColor: colorDrawer,
        bgcolor: colorDrawer,
    },
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
}));

export const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    color: blueUltraDark,
    backgroundColor: alpha(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));


export const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "&.MuiDataGrid-root ": {
    "& .MuiDataGrid-renderingZone": {
      maxHeight: "none !important"
    },
    "& .MuiDataGrid-cell--withRenderer": {
      lineHeight: "unset !important",
      maxHeight: "none !important",
      whiteSpace: "normal"
    },
    "& .MuiDataGrid-row": {
      maxHeight: "none !important",
    },
    "& .MuiDataGrid-cell:focus-within" : {
      outline: "none !important",
      whiteSpace: "normal"
    },
  },
}));
