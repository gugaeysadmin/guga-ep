"use client"
import React ,{ useState, useEffect}from "react";
import { useDispatch, useSelector } from 'react-redux';

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SendIcon from '@mui/icons-material/Send';


import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Modal, Paper, Select, SelectChangeEvent, Typography } from "@mui/material";
import { colorText, modalBgColor, colorImage, pageBgColor } from "../Styles/general";
import { useQuery } from "@tanstack/react-query";
import { getCommercialAgents } from "../services/catalogServices";
import { LogInInfo, commercialAgents } from "../entities/domains";
import { logIn } from "../reducer/sliceUser";
import { PayloadAction } from "@reduxjs/toolkit";
import { useAppDispatch } from "../hooks/redux";


const userList = [
    "Vanessa Abigail Juarez Ramirez",
    "Luis Antonio Quesada Alonso",
    "Jose",
    "Pedro",
    "Pepe"
]

const styleBoxModalAuto = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "70%", md: "100%" },
    maxWidth: 350,
    maxHeigh: "auto",
    bgcolor: modalBgColor,
    boxShadow: 24,
    p: 4,
    borderRadius: "8px 8px 8px 8px",
  }
const LoginPage = () => {
    const [userSelected, setUserSelected] = useState<commercialAgents>();

    const dispatch = useAppDispatch();

    const commercialAgents = useQuery({queryKey:["getCommercialAgents"], queryFn: getCommercialAgents, refetchOnWindowFocus: false});

    const handleChange = (event: SelectChangeEvent<commercialAgents>) => {
        const userSelected = commercialAgents.data?.filter((element: commercialAgents)=> element.agentId === event.target.value);
        if(!!userSelected)
            setUserSelected(userSelected[0]);
    }   

    const handleOnClick = () => {
        let userInfo : LogInInfo;
        if(userSelected){






            userInfo = {
                logIn: {
                    logged: true ,
                    name: userSelected.names,
                    lastName: userSelected.firstLastName || "", 
                    secondLastName: userSelected.secondLastName || "",
                    userId: userSelected.agentId || "",
                    isAdmin: userSelected.isAdmin || false, 
                }
            }  
           dispatch(logIn(userInfo));
        }
    }


    return (<>
        <Modal open>
            <Box
                height={"auto"}
                marginBottom={4}
                marginTop={4}
                display="flex"
                alignItems="center"
                sx={styleBoxModalAuto}
            >
                <Grid 
                    container 
                    spacing={3}
                    display="flex"
                    alignItems="center"
                >
                    <Grid item xs={12} display="flex" justifyContent="center">
                        <Typography variant="h5" color="black"> Iniciar sesión</Typography>
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="center">
                        <AccountBoxIcon sx={{ fontSize: 200, color: colorImage}}/>
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="center">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">User</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={userSelected}
                                label="Usuario"
                                onChange={handleChange}
                            >

                                {!!commercialAgents.data && commercialAgents.data.map((element: commercialAgents, index)=>(
                                    <MenuItem key={index} value={element.agentId}>{element.names + " " + element.firstLastName + " " + element.secondLastName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="center">
                    <Button variant="contained" endIcon={<SendIcon />} disabled={!!!userSelected} onClick={handleOnClick}>
                        Entrar
                    </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    
    </>)
}


export default LoginPage;