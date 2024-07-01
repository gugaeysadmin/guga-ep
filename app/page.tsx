'use client'
import React, { useEffect, useRef, useState } from "react";
import './globals.css';

import HomePage from "./components/HomePage";
import SideBar from "./components/Sidebar";
import NewCotization from "./nueva-cotizacion/NewCotization";
import Catalogs from "./catalogos/Catalogs";
import Reports from "./reportes/Reports";
import LoginPage from "./components/LogIn";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { getClientsReducer } from "./reducer/sliceClients";
import { getEquipmentReducer } from "./reducer/sliceEquipment";
import { getCommertialAgentReducer } from "./reducer/sliceCommercialAgents";
import SideBarDrawer from "./components/SideBarDrawer";
import { Box, Button, Grid, IconButton, Slide, Snackbar, Typography, SlideProps, CircularProgress } from "@mui/material";
import { Block } from "@mui/icons-material";
import { backgroundColorBlue, backgroundColorLightBlue, backgroundColorWhite, backgroundLoggedColorLightBlue, backgroundLoggedColorWhite, blueLight, successGreen, successGreenButton } from "./Styles/general";
import LoginHeader from "./components/LogInHeader";
import Background from "./components/Background";

import CloseIcon from '@mui/icons-material/Close';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

import {
  checkUpdate,
  installUpdate,
  onUpdaterEvent,
  UpdateStatus
} from '@tauri-apps/api/updater'
import { relaunch } from '@tauri-apps/api/process'



const Home = () => {
  const [open, setOpen] = useState(true);
  const [updates, setUpdates] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [newVersion, setNewVersion] = useState("")

  const isLogged = useAppSelector(state => state.sliceUserReducer.logIn.logged);
  const page = useAppSelector(state => state.sliceSectionReducer.section);
  const dispatch = useAppDispatch();


  useEffect(()=> {
    checkUpdate().then(({ shouldUpdate, manifest }) => {
      if (shouldUpdate) {
        const { version: newVersion, body: releaseNotes } = manifest;
        setNewVersion(newVersion);
        setUpdates(true);
      }
    });
  },[])

  const install = () => {
    setUpdating(true);
    installUpdate().then(() =>{ 
        relaunch().then(() => {
          setUpdates(false);
          setUpdating(false);
        })
    });
    
  }

  const handleClose = ( event?: React.SyntheticEvent | Event, reason?: string ) => {
    if (reason === 'clickaway') {
      return;
    }
    setUpdates(false);
  }  


  const UpdateNotification = () => {  
    return (
        <Box sx={{
          position: "absolute",
          top: "80%",
          right: "1%",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "4px 4px 4px 4px",
          height: 100,
          width: 340,
          transition: 'transform 2.5s, bottom 2.5s',
          visibility: updates ? 'visible' : 'hidden',
          zIndex: 20000,
        }}>
          <Grid container sx={{height: "100%" }}>
            <Grid item xs={1.5} sx={{ height: "100%", borderRadius: "2px 0px 2px 0px", justifyContent: "center", alignItems: "center", backgroundColor: successGreen}}>
              <Box sx={{ 
                height: "100%", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                backgroundColor: successGreen,
                borderRadius: "4px 4px 4px 3px",
                color: "background.paper"
              }} >
                {updating ? <CircularProgress size={20} color="success"/> : <CloudDownloadIcon/>}
              </Box>
            </Grid>
            <Grid item xs={9.5} sx={{padding: 1}}>
              <Typography variant="subtitle2" sx={{fontWeight: "bold", mt: 1}}>Actualizacion v{newVersion} disponible</Typography>
              {/* <Typography variant="caption">Guardar avances</Typography> */}
              <Button 
                variant="contained"
                sx={{
                  mt: 1,
                  backgroundColor: successGreenButton,
                }}
                onClick={install} 
                fullWidth
                disabled={updating}
              >
               {updating ? "Actualizando..." : "Instalar y reiniciar"}
              </Button>
            </Grid>
            <Grid item xs={1} sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
              <IconButton size="small" onClick={handleClose}>
                <CloseIcon/>
              </IconButton>
            </Grid>
          </Grid>
            
        </Box>
    )
  }
  return (
    <>
      <Box
        sx={{
          margin: 0,
          height: "100%",
          //backgroundColor:"red",
          background: isLogged ? 
            `none`:
            `linear-gradient(180deg, ${backgroundColorBlue}, 30%, ${backgroundColorLightBlue})`
            ,
        }}
      >
        {isLogged?(<>
          {/* <SideBar>
            {page === 1 && <HomePage/>}
            {page === 2 && <NewCotization/>}
            {page === 3 && <Catalogs/>}
            {page === 4 && <Reports/>}
            {page === -1 && <></>}
          </SideBar> */}
          <Box display={"flex"}>
            <SideBarDrawer
              open={open}
              setOpen={setOpen}
            />
            <Box sx={{ maxWidth: { xs: 'calc(100vw - 60px)', md: open? 'calc(100vw - 285px)': 'calc(100vw - 60px)'} }}>
            <Background open={open}/>
              {page === 1 && <HomePage/>}
              {page === 2 && <NewCotization/>}
              {page === 3 && <Catalogs />}
              {page === 4 && <Reports/>}
              {page === -1 && <></>}
            </Box>
                {/* 
                {page === 1 && <HomePage/>}
                {page === 2 && <NewCotization/>}
                {page === 3 && <Catalogs />}
                {page === 4 && <Reports/>}
                {page === -1 && <></>} 
                */}
          </Box>
        </>):(<>
          <LoginHeader/>
          <LoginPage/>
        </>)}
      </Box>
        <UpdateNotification/>
    </>
  )
}
export default Home;