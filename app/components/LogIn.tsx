"use client"
import React ,{ useState, useEffect}from "react";

import CircularProgress from '@mui/material/CircularProgress';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SendIcon from '@mui/icons-material/Send';


import { Box, Button, Collapse, FormControl, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Modal, OutlinedInput, Paper, Select, SelectChangeEvent, Typography } from "@mui/material";
import { colorText, modalBgColor, colorImage, pageBgColor, blueLight } from "../Styles/general";
import { useQuery } from "@tanstack/react-query";
import { getCommercialAgents } from "../services/catalogServices";
import { commercialAgents } from "../entities/domains";
import { logIn } from "../reducer/sliceUser";
import { useDateField } from "@mui/x-date-pickers/DateField/useDateField";
import { useAppDispatch } from "../hooks/redux";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { verifyPassword } from "../services/security";
import { usePassValidation } from "../hooks/usePassValidation";
import { Result } from "postcss";
import { handleCommertialAgentFullName } from "../catalogos/components/TableRowConfiguration";



const styleBoxModalAuto = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "70%", md: "100%" },
    maxWidth: 280,
    maxHeigh: "auto",
    minHeight: 340,
    //bgcolor: modalBgColor,
    bgcolor: "background.paper",
    boxShadow: 4,
    p: 2,
    borderRadius: "4px 4px 4px 4px",
  }


const LoginPage= ({}) => {
    const [userSelected, setUserSelected] = useState<commercialAgents>();
    const [password, setPassword] = useState('');
    const passwordValidation = usePassValidation(password);
    const [pwdError, setPwdError] = useState(false);

    const dispatch = useAppDispatch();
    const commercialAgents = useQuery({queryKey:["getCommercialAgents"], queryFn: getCommercialAgents, refetchOnWindowFocus: false});

    useEffect(()=> { setPassword("")},[])
    const handleChange = (event: SelectChangeEvent<commercialAgents>) => {
        const userSelected = commercialAgents.data?.filter((element: commercialAgents)=> element.agentId === event.target.value);
        if(!!userSelected){
            setUserSelected(userSelected[0]);
            passwordValidation.setHashedPassword(userSelected[0].password);
        }
    }   
    
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleChangePassword = (event) => {
        setPwdError(false);
        setPassword(event.target.value);
    };
    const handleOnClick =  () => {
        if(userSelected){
            if(userSelected.isAdmin){
                passwordValidation.validate().then((result)=> {
                    console.log(result);
                    if(result){
                        setPwdError(false);
                        saveUserSelected();
                    } else {
                        setPwdError(true);
                    }
                })
            }else {
                saveUserSelected();
            }
        }
    }

    const saveUserSelected =  () => {
        dispatch(logIn({
            logIn: {
                logged: true,
                name: userSelected.names,
                lastName: userSelected.firstLastName,
                secondLastName: userSelected.secondLastName,
                userId: userSelected.agentId,
                isAdmin: userSelected.isAdmin, 
            }
        }))
    };

    return (<>
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
                display="flex"
                alignItems="center"
                justifyContent="center"
            >

                {commercialAgents.isLoading?(<>
                    <CircularProgress size={100}/>
                </>):(<>
                    <Grid item xs={12} display="flex" justifyContent="center">
                        <AccountBoxIcon sx={{ fontSize: 200, color: blueLight}}/>
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="center" marginBottom={2} marginTop={1}>
                        <FormControl fullWidth defaultValue={""}>
                            <InputLabel id="demo-simple-select-label">Usuario</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={userSelected}
                                label="Usuario"
                                onChange={handleChange}
                            >

                                {!!commercialAgents.data && commercialAgents.data.map((element: commercialAgents, index)=>(
                                    <MenuItem key={index} value={element.agentId}>{handleCommertialAgentFullName(element.names, element.firstLastName, element.secondLastName)}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Collapse in={typeof userSelected !== 'undefined' && !!userSelected && userSelected.isAdmin}>
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <FormControl sx={{mb: 3}} variant="outlined"  fullWidth required error = {pwdError}>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={handleChangePassword}
                                    required 
                                    defaultValue={""}
                                    error = {pwdError}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                    </InputAdornment>
                                    }
                                    label="Password"
                                />
                                {pwdError && 
                                    <FormHelperText error>{passwordValidation.validationMessage}</FormHelperText>
                                }
                            </FormControl>
                        </Collapse>
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="center">
                        <Button 
                            variant="contained" 
                            color="primary"  
                            endIcon={<SendIcon/>} 
                            onClick={handleOnClick} 
                            disabled={!!!userSelected} 
                            sx={{width: 120}}
                        >
                            Entrar
                        </Button>
                    </Grid>
                </>)}
            </Grid>
        </Box>
    
    </>)
}


export default LoginPage;
