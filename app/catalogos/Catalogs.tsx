'use client'
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {    Box,
            Grid,
            List,
            ListItem,
            ListItemIcon,
            ListItemButton,
            ListItemText,
            Divider,
            Tooltip,
            IconButton,
            CircularProgress,
            Stack,
            Typography,
            Container,
            Collapse,
            useTheme,
            useMediaQuery
} from "@mui/material";


import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ComputerIcon from '@mui/icons-material/Computer';
import DomainIcon from '@mui/icons-material/Domain';
import { ArrowRight, Computer } from "@mui/icons-material";
import AddIcon from '@mui/icons-material/Add';

import { homeStyle, colorText, blueLight, blueLightHover, colorTextWhite, sidebarColor } from "../Styles/general";

import CatalogsTable from "./components/CatalogsTable";
import EnhancedTable from "../nueva-cotizacion/components/EnhancedTable";
import NewClient from "./components/NewClient";
import NewCommercialAgent from "./components/NewCommercialAgent";
import NewEquipment from "./components/NewEquipment";
import { getClients, getCommercialAgents, getEquipments, removeClients, removeCommercialAgent, removeEquipment, updateEquipments } from "../services/catalogServices";
import Header from "../components/Header";
import { useAppSelector } from "../hooks/redux";
import { clients, commercialAgents, referenceEquipment } from "../entities/domains";
import { WarnMessage } from "../components/WarnMessage";
import EnhancedFilter from "../components/EnhancedFilter";

const Catalogs = () =>{

    const [table, setTable] = useState("clients");
    const [warnMessageOpen, setWarnMessageOpen] = useState(false);
    const [deleteInfo, setDeleteInfo] = useState({id: "", section: ""})
    const [openNewClient, setOpenNewClient] = useState(false);
    const [openNewCommercialAgent, setOpenNewCommercialAgent] = useState(false);
    const [openNewEquipment, setOpenNewEquipment ]= useState(false);
    const [clientData, setClientData ] = useState<clients>();
    const [commercialAgentData, setCommercialAgentData] = useState<commercialAgents>()
    const [caIsNew, setCaIsNew] = useState(true);
    const [equipmentData, setEquipmentData] = useState<referenceEquipment>();
    const [filteredClients, setFilteredClients] = useState<clients[]>();
    const [filteredCommercialAgents, setFilteredCommercialAgents] = useState<commercialAgents[]>();
    const [filteredEquipments, setFilteredEquipments] = useState<referenceEquipment[]>();


    const clients = useQuery({queryKey:["getClients"], queryFn: getClients, refetchOnWindowFocus: false});
    const commercialAgents = useQuery({queryKey:["getCommercialAgents"], queryFn: getCommercialAgents, refetchOnWindowFocus: false});
    const referenceEquipments = useQuery({queryKey:["getReferenceEquipments"], queryFn: getEquipments, refetchOnWindowFocus: false});

    const theme = useTheme();
    const isFull = useMediaQuery(theme.breakpoints.down('md'));


    const user = useAppSelector((state)=> state.sliceUserReducer.logIn);


    const handleOpenNewClient = () => {(openNewClient) ? setOpenNewClient(false) : setOpenNewClient(true)};
    const handleOpenNewCommercialAgent =() => (openNewCommercialAgent) ? setOpenNewCommercialAgent(false) : setOpenNewCommercialAgent(true);
    const handleOpenNewEquipment = () => (openNewEquipment) ? setOpenNewEquipment(false) : setOpenNewEquipment(true);
    const handleDeleteMessage = (id: any, section: string ) => {
        setDeleteInfo({id: id, section: section})
        setWarnMessageOpen(true);
    }


    useEffect(()=>{
        if(clients.isSuccess)
            setFilteredClients(clients.data);
        if(commercialAgents.isSuccess)
            setFilteredCommercialAgents(commercialAgents.data);
        if(referenceEquipments.isSuccess)
            setFilteredEquipments(referenceEquipments.data);
    },[clients.data, commercialAgents.data, referenceEquipments.data])

    useEffect(()=>{
        setFilteredClients(clients.data);
        setFilteredCommercialAgents(commercialAgents.data);
        setFilteredEquipments(referenceEquipments.data);
    },[table])

    useEffect(()=>{
        if(!openNewEquipment) setEquipmentData(null);
        if(!openNewClient) setClientData(null);
        if(!openNewCommercialAgent) setCommercialAgentData(null);
    },[openNewClient,openNewCommercialAgent,openNewEquipment])

    const handleDelete = (id: any, section: string ) => {
        switch (section){
            case 'clients':
                removeClients(id).then(()=> {
                    clients.refetch();
                });
                break;
            case 'commercialAgents':
                removeCommercialAgent(id).then(()=> {
                    commercialAgents.refetch();
                });
                break;
            case 'referenceEquipment':
                removeEquipment(id).then(()=> {
                    referenceEquipments.refetch();
                });
                break;
            default: 
                console.log("section not found")
        }
    }

    const handleEdit = (id: any, section: string ) => {

        switch (section){
            case 'clients':
                setClientData(clients.data.filter(element=> element.clientId === id)[0]);
                setOpenNewClient(true);

                break;
            case 'commercialAgents':
                setCaIsNew(false);
                setCommercialAgentData(commercialAgents.data.filter(element=> element.agentId === id)[0]);
                setOpenNewCommercialAgent(true);
                break;
            case 'referenceEquipment':
                setEquipmentData(referenceEquipments.data.filter(element=> element.referenceId === id)[0]);
                setOpenNewEquipment(true);
                break;
            default: 
                console.log("section not found")
        }
    }

    const refresh = (section: string) => {
        clients.refetch();
        commercialAgents.refetch();
        referenceEquipments.refetch();
        setTable(section);
    }
    return(
    <>
        <Grid container spacing={1}>
            <Grid item xs={12} sm={12} md={12}>
                <Header>Catálogos</Header>
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ ml:1, mt:1, display:'flex',flexDirection:'row', justifyContent: 'space-between', color: 'white'}}>
                    <EnhancedFilter
                        data={
                            table === "clients"? 
                            clients.data :
                            table === "commercialAgents"?
                            commercialAgents.data :
                            referenceEquipments.data
                        }
                        setDataFilter={
                            table === "clients"? 
                            setFilteredClients :
                            table === "commercialAgents"?
                            setFilteredCommercialAgents:
                            setFilteredEquipments
                        }
                    />
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={12} xl={12} mx={2}>
                    <List component={Stack} direction={ !isFull? "row": "column"}  spacing={2}>
                        {/*Clients*/}
                         <ListItem 
                            sx={{
                                backgroundColor: sidebarColor,
                                '&:hover, &:focus': {
                                    backgroundColor: blueLight,
                                    color: 'black'
                                },
                            }}
                        >
                            <ListItemButton 
                                sx={{
                                    height: 56,
                                }}
                                onClick={()=>setTable("clients")}
                            >
                                <ListItemIcon>
                                    <DomainIcon sx={{color: colorTextWhite}}/>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Clientes"
                                    primaryTypographyProps={{
                                        color: colorTextWhite,
                                        fontWeight: 'medium',
                                        variant: 'body2',
                                    }}
                                />
                            </ListItemButton>
                            <Tooltip title="Agregar nuevo cliente">
                                <IconButton
                                    size="large"
                                    onClick={()=> {
                                        setClientData(client => null);
                                        handleOpenNewClient();
                                    }}
                                    sx={{
                                        '& svg': {
                                        color: colorTextWhite,
                                        transition: '0.2s',
                                        transform: 'translateX(0) rotate(0)',
                                        },
                                        '&:hover': {
                                        bgcolor: 'unset',
                                        '& svg:first-of-type': {
                                            transform: 'translateX(-4px) rotate(-90deg)',
                                        },
                                        '& svg:last-of-type': {
                                            right: 0,
                                            opacity: 1,
                                        },
                                        },
                                        '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        height: '80%',
                                        display: 'block',
                                        left: 0,
                                        width: '1px',
                                        bgcolor: 'divider',
                                        },
                                    }}
                                >
                                <AddIcon />
                                <ArrowRight sx={{ position: 'absolute', right: 4, opacity: 0 }} />
                                </IconButton>
                            </Tooltip>
                        </ListItem> 
                        <Divider light sx={{ borderBottomWidth: 5}}/>
                        {/*Reference Equipment*/}
                         <ListItem
                            sx={{
                                backgroundColor: sidebarColor,
                                '&:hover, &:focus': {
                                    backgroundColor: blueLight,
                                    color: 'black'
                                },
                            }}
                            onClick={()=>setTable("referenceEquipment")}
                        >
                            <ListItemButton sx={{height: 56}}>
                                <ListItemIcon>
                                    <ComputerIcon sx={{color: colorTextWhite}}/>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Equipo "
                                    primaryTypographyProps={{
                                        color: colorTextWhite,
                                        fontWeight: 'medium',
                                        variant: 'body2',
                                    }}
                                />
                            </ListItemButton>
                            <Tooltip title="Agregar Eqipo de referencia">
                                <IconButton
                                    size="large"
                                    onClick={()=> {
                                        setEquipmentData(equipment => null);
                                        handleOpenNewEquipment();
                                    }}
                                    sx={{
                                        '& svg': {
                                        color: colorTextWhite,
                                        transition: '0.2s',
                                        transform: 'translateX(0) rotate(0)',
                                        },
                                        '&:hover': {
                                        bgcolor: 'unset',
                                        '& svg:first-of-type': {
                                            transform: 'translateX(-4px) rotate(-90deg)',
                                        },
                                        '& svg:last-of-type': {
                                            right: 0,
                                            opacity: 1,
                                        },
                                        },
                                        '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        height: '80%',
                                        display: 'block',
                                        left: 0,
                                        width: '1px',
                                        bgcolor: 'divider',
                                        },
                                    }}
                                >
                                <AddIcon />
                                <ArrowRight sx={{ position: 'absolute', right: 4, opacity: 0 }} />
                                </IconButton>
                            </Tooltip>
                        </ListItem> 
                        <Divider light sx={{ borderBottomWidth: 5}}/>
                        {/*Comertial Agent*/}
                        <ListItem
                            sx={{
                                backgroundColor: sidebarColor,
                                '&:hover, &:focus': {
                                    backgroundColor: blueLight,
                                    color: 'black'
                                },
                            }}
                            onClick={()=>setTable("commercialAgents")}
                        >
                            <ListItemButton sx={{height: 56}}>
                                <ListItemIcon>
                                    <AssignmentIndIcon sx={{color: colorTextWhite}}/>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Agentes Comerciales"
                                    primaryTypographyProps={{
                                        color: colorTextWhite,
                                        fontWeight: 'medium',
                                        variant: 'body2',
                                    }}
                                />
                            </ListItemButton>
                            {user.isAdmin &&
                                <Tooltip title="Agregar Agente Comercial">
                                    <IconButton
                                        size="large"
                                        onClick={()=> {
                                            setCaIsNew(true);
                                            setCommercialAgentData(agent => null);
                                            handleOpenNewCommercialAgent();
                                        }}
                                        disabled={!user.isAdmin}
                                        sx={{
                                            '& svg': {
                                            color: colorTextWhite,
                                            transition: '0.2s',
                                            transform: 'translateX(0) rotate(0)',
                                            },
                                            '&:hover': {
                                            bgcolor: 'unset',
                                            '& svg:first-of-type': {
                                                transform: 'translateX(-4px) rotate(-90deg)',
                                            },
                                            '& svg:last-of-type': {
                                                right: 0,
                                                opacity: 1,
                                            },
                                            },
                                            '&:after': {
                                            content: '""',
                                            position: 'absolute',
                                            height: '80%',
                                            display: 'block',
                                            left: 0,
                                            width: '1px',
                                            bgcolor: 'divider',
                                            },
                                        }}
                                    >
                                    <AddIcon />
                                    <ArrowRight sx={{ position: 'absolute', right: 4, opacity: 0 }} />
                                    </IconButton>
                                </Tooltip>
                            }
                        </ListItem>
                    </List>

            </Grid>
            <Grid item xs={12} sm={12} md={12} xl={12}>
                {clients.isSuccess && referenceEquipments.isSuccess && commercialAgents.isSuccess ? (
                    <Box sx={{mr: 2, ml: 2}}>
                        { table === "clients" &&(
                            <CatalogsTable
                                data={!!filteredClients? filteredClients: []}
                                source= {table}
                                handleEdit={handleEdit}
                                handleRemove={handleDeleteMessage}
                            />
                        )}
                        { table === "commercialAgents" &&(
                            <CatalogsTable
                                data={filteredCommercialAgents? filteredCommercialAgents : []}
                                source= {table}
                                handleEdit={handleEdit}
                                handleRemove={handleDeleteMessage}
                            />
                        )}   
                        { table === "referenceEquipment" &&(
                            <CatalogsTable
                                data={filteredEquipments? filteredEquipments : []}
                                source= {table}
                                handleEdit={handleEdit}
                                handleRemove={handleDeleteMessage}
                            />
                        )}
                    </Box>  
                ):(
                    <Box height="80vh" sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <CircularProgress color="secondary" />
                    </Box>
                )}
            </Grid>
        </Grid>

        <NewClient
            open={openNewClient}
            handleOpen={handleOpenNewClient}
            refresh={refresh}
            clientData={clientData}
        />
        <NewCommercialAgent
            open={openNewCommercialAgent}
            handleOpen={handleOpenNewCommercialAgent}
            refresh={refresh}
            commercialAgentData={commercialAgentData}
            isNew = {caIsNew}
        />
        <NewEquipment
            open={openNewEquipment}
            handleOpen={handleOpenNewEquipment}
            refresh={refresh}
            equipmentData={equipmentData}
        />
        <WarnMessage
            visible={warnMessageOpen}
            setVisible={setWarnMessageOpen}
            onAgree={()=> {handleDelete(deleteInfo.id, deleteInfo.section)}} 
        >
            <Typography variant="h5" textAlign={"center"}>¿Esta seguro que desea eliminar este elemento?</Typography>
        </WarnMessage>
    </>
    )
}

export default Catalogs;