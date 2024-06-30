'use client'
import React, {ReactNode, useEffect, useState} from "react";

import {Box,
        Grid,
        Paper,
        List,
        ListItem,
        ListItemButton,
        ListItemIcon,
        ListItemText,
        Divider,
        Typography,
        Avatar,
        Button,
        IconButton,
        styled,
        CSSObject,
        Theme,
        useTheme,
        useMediaQuery,
        } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import HistoryIcon from '@mui/icons-material/History';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import LogoutIcon from '@mui/icons-material/Logout';

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';


import { sideBarButtonStyles } from "../Styles/buttons";
import { backgroundColorBlue, backgroundColorLightBlue, backgroundLoggedColorLightBlue, blueDark, blueLight, blueUltraDark, colorDrawer, colorTextBlack, colorTextWhite, sideBarStyle, sidebarColor } from "../Styles/general";

import { setAvatarProps } from "../hooks/setAvatarProps";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useDispatch } from "react-redux";
import { changeSection } from "../reducer/sliceSections";
import { resetCurrentCotization } from "../reducer/sliceCurrentCotization";
import { logOut } from "../reducer/sliceUser";
import { blue } from "@mui/material/colors";


const drawerWidth = 270;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);



type SideBarProps = {
    children?: ReactNode;
    open: boolean;
    setOpen: (status: boolean) => void;
}

const SideBarDrawer: React.FC<SideBarProps> = ({children, open, setOpen}) => {
    
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isExtraSmallScreen = useMediaQuery(theme.breakpoints.only('xs'));

    const dispatch = useAppDispatch();
    const user = useAppSelector((state)=> state.sliceUserReducer.logIn);
    const existentData = useAppSelector((state) => state.sliceCurrentCotizationReducer.data);
    
    useEffect(()=> {
        isSmallScreen ? setOpen(false): setOpen(true);
    },[isSmallScreen])

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: open? 'flex-end': 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
      }));
      
      interface AppBarProps extends MuiAppBarProps {
        open?: boolean;
      }


    const setPage = (page) => {
        dispatch(changeSection(page))
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        open?setOpen(false): setOpen(true);
    };

    const handleCloseSessions = () => {
        window.location.reload()
        //document.body.style.backgroundColor = backgroundColorLightBlue;
    };
    return(

        <Drawer variant="permanent" open={open}
            sx={{
                '& .MuiDrawer-paper': {
                    //backgroundColor: 'grey', // Cambia 'blue' al color que desees
                    //backgroundColor: sidebarColor, // Cambia 'blue' al color que desees
                    //background: `linear-gradient(180deg, ${sidebarColor}, 80%, ${blueUltraDark})`
                    background: `linear-gradient(180deg, ${backgroundColorBlue}, 70%, ${backgroundColorLightBlue})`,
                },
            }}
        >
            
            {!isExtraSmallScreen&&
            <DrawerHeader>
                <IconButton onClick={handleDrawerClose}>
                    {open ? <ChevronLeftIcon sx={{color: colorTextWhite,}} /> : <MenuIcon sx={{color: colorTextWhite,}} />}
                </IconButton>
            </DrawerHeader>
            }
            <Box sx={{display: 'block', margin: '0 auto', marginBottom: open?3:2, marginTop:1}}>
                <Avatar 
                    sx={{
                        width: open? 120: 45,
                        height: open? 120: 45,
                        fontSize: open? 60: 20,
                        color: colorTextBlack,
                        bgcolor: "white"
                    }}
                >
                    {
                        setAvatarProps(user.name + " " + user.lastName).children
                    }
                </Avatar>
            </Box>
            <List>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        onClick={()=>setPage(1)}
                        sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        color: colorTextWhite,
                        }}
                    >
                        <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                            color: colorTextWhite,
                        }}
                        >
                        <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Mis cotizaciones"} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        onClick={async ()=>{
                            resetCurrentCotization();
                            await setPage(-1);
                            await setPage(2);
                        }}
                        sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        color: colorTextWhite,
                        }}
                    >
                        <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                            color: colorTextWhite,
                        }}
                        >
                        <NoteAddIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Nueva Cotización"} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton
                        onClick={()=>setPage(3)}
                        sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        color: colorTextWhite,
                        }}
                    >
                        <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                            color: colorTextWhite,
                        }}
                        >
                        <Inventory2Icon />
                        </ListItemIcon>
                        <ListItemText primary={"Catálogos"} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
                {user.isAdmin &&
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            onClick={()=>setPage(4)}
                            sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                            color: colorTextWhite,
                            }}
                            disabled = {false}
                        >
                            <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                                color: colorTextWhite,
                            }}
                            >
                            <HistoryIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Reportes"} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                }
            </List>

            <Box 
                sx={{
                    display: "flex",
                    height: "100%",
                }}
            >

                <IconButton
                    sx={{
                        marginRight: "auto",
                        marginTop: "auto",
                        marginBottom: 2,
                        marginLeft: open ? 2: "auto",
                        color: colorTextWhite,
                    }}
                    onClick={  handleCloseSessions }
                >
                    <LogoutIcon  fontSize="inherit"/>
                </IconButton>
            </Box>
        </Drawer>
    )
}

export default SideBarDrawer;