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
import { Box, Grid } from "@mui/material";
import { Block } from "@mui/icons-material";
import { backgroundColorBlue, backgroundColorLightBlue, backgroundColorWhite, backgroundLoggedColorLightBlue, backgroundLoggedColorWhite } from "./Styles/general";
import LoginHeader from "./components/LogInHeader";
import Background from "./components/Background";



const Home = () => {
  const [open, setOpen] = useState(true);
  const isLogged = useAppSelector(state => state.sliceUserReducer.logIn.logged);
  const page = useAppSelector(state => state.sliceSectionReducer.section);
  const dispatch = useAppDispatch();




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
    </>
  )
}
export default Home;