'use client'
import React, {ReactNode, useEffect, useState} from "react";

import {Box,
        Grid,
        Paper,
        Drawer,
        List,
        ListItem,
        ListItemButton,
        ListItemIcon,
        ListItemText,
        Divider,
        Typography,
        Avatar,
        Button,
        } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import HistoryIcon from '@mui/icons-material/History';

import { sideBarButtonStyles } from "../Styles/buttons";
import { colorTextBlack, colorTextWhite, sideBarStyle, sidebarColor } from "../Styles/general";

import { setAvatarProps } from "../hooks/setAvatarProps";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useDispatch } from "react-redux";
import { changeSection } from "../reducer/sliceSections";
import { resetCurrentCotization } from "../reducer/sliceCurrentCotization";

type SideBarProps = {
    children: ReactNode;
}

const SideBar: React.FC<SideBarProps> = ({children}) => {
    const [open, setOpen] = useState(true);

    const dispatch = useAppDispatch();
    const user = useAppSelector((state)=> state.sliceUserReducer.logIn);
    const existentData = useAppSelector((state) => state.sliceCurrentCotizationReducer.data);
    
    useEffect(()=> {
        console.log(user.isAdmin)
    },[])

    const setPage = (page) => {
        dispatch(changeSection(page))
    }
    return (

        <Grid container>
            <Grid item xs={0} md={3}>
                <Box
                    component="nav"
                    sx={{ 
                        height: '100vh' , 
                        display: { xs: "none", sm: "none", md: 'block'}, 
                        position:'fixed',
                    }}
                    width={'23vw'}
                    bgcolor={sidebarColor}
                >
                    <Box
                        height={150}
                        bgcolor={sidebarColor}
                        marginBottom={4}
                        marginTop={8}
                        display="flex"
                        alignItems="center"
                    >
                        <Grid 
                            container 
                            spacing={2}
                            display="flex"
                            alignItems="center"
                        >
                            <Grid item xs={12} display="flex" justifyContent="center">
                                <Avatar 
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        fontSize: 60,
                                        color: colorTextBlack,
                                        bgcolor: "white"
                                    }}
                                >
                                    {
                                        
                                    setAvatarProps(user.name + " " + user.lastName + " " + user.secondLastName).children
                                    }
                                </Avatar>
                            </Grid>
                            <Grid item xs={12} display="flex" justifyContent="center">
                                <Typography variant="h5" color={colorTextWhite}> Bienvenido/a!!</Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider color="#7a8494" sx={{ml: 3, mr: 3}}/>
                    
                    <Box marginTop={4} paddingRight={3} paddingLeft={3}>                        
                       <List>
                            <ListItem disablePadding>
                                 <ListItemButton 
                                    onClick={()=>setPage(1)}
                                    sx={sideBarButtonStyles}
                                >
                                    <ListItemText sx={{color: colorTextWhite}}> Mis cotizaciones </ListItemText>
                                    <ListItemIcon>
                                        <HomeIcon sx={{ml: 4, fontSize: 30, color: colorTextWhite}}/>
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>
                            <ListItem alignItems="flex-start" disablePadding>
                                <ListItemButton 
                                    onClick={async ()=>{
                                        await setPage(-1)
                                        await setPage(2);
                                    }}
                                    sx={sideBarButtonStyles}
                                >
                                    <ListItemText sx={{color: colorTextWhite}}> Nueva Cotización </ListItemText>
                                    <ListItemIcon>
                                        <NoteAddIcon sx={{ml: 4, fontSize: 30, color: colorTextWhite}}/>
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>
                            <ListItem alignItems="flex-start" disablePadding>
                            <ListItemButton 
                                    onClick={()=>setPage(3)}
                                    sx={sideBarButtonStyles}
                                >
                                    <ListItemText sx={{color: colorTextWhite}}>Catalogos</ListItemText>
                                    <ListItemIcon>
                                        <Inventory2Icon sx={{ml: 4, fontSize: 30, color: colorTextWhite}}/>
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>

                            {user.isAdmin &&
                                <ListItem alignItems="flex-start" disablePadding>
                                     <Box sx={{width: "100%", display: "flex", flexDirection: "row"}}>
                                        <ListItemButton 
                                            onClick={()=>setPage(4)}
                                            sx={sideBarButtonStyles}
                                            >
                                            <ListItemText sx={{color: colorTextWhite}}>Reportes</ListItemText>
                                            <ListItemIcon>
                                                <HistoryIcon sx={{ml: 4, fontSize: 30, color: colorTextWhite}}/>
                                            </ListItemIcon>
                                        </ListItemButton>
                                    </Box>     
                                </ListItem>
                            }
                        </List> 
                    
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={12} md= {9}>
                {children}
            </Grid>
        </Grid>
    )
}

export default SideBar;