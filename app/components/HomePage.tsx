'use client'
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {  Box,
          Paper,
          Typography,
          CircularProgress,
          Avatar,
          Card,
          Grid,
          CardActions,
          CardContent,
          IconButton,
          Collapse,
          Zoom,
          Modal,
} from "@mui/material" 

import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { blueDark, darkBlueGrey, homeStyle } from ".././Styles/general";
import { colorText } from ".././Styles/general";

import { setAvatarProps } from ".././hooks/setAvatarProps";
import { getCotizationsOverview, removeCotization } from ".././services/cotizationService";

import {  StyledButton,
          Search,
          SearchIconWrapper,
          StyledInputBase,
} from ".././Styles/styledComponents/StyledComponents";
import { cotizationGeneralData } from ".././entities/cotization";
import Header from ".././components/Header";
import { WarnMessage } from "./WarnMessage";
import { PDFViewer } from "@react-pdf/renderer";
import GugaDocument from "../documentPdf/GugaDocument";
import { useCotization } from "../hooks/useCotization";
import { changeSection } from "../reducer/sliceSections";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setCurrentCotization } from "../reducer/sliceCurrentCotization";
import DocumentViewer from "../documentPdf/DocumentViewer";
import EnhancedFilter from "./EnhancedFilter";
import { handleCommertialAgentFullName } from "../catalogos/components/TableRowConfiguration";


const HomePage = () => {

  const [warnMessageOpen, setWarnMessageOpen] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState("");
  const [openViewPDF, setOpenViewPDF] = useState(false);
  const [data, setData] = useState<cotizationGeneralData[]>();
  const cotization = useCotization();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state)=> state.sliceUserReducer.logIn);

  const {data: sourceData, isSuccess, isFetching, refetch} = useQuery<cotizationGeneralData[]>({queryKey: ["getCotizationsOverview"], queryFn:()=> getCotizationsOverview(handleCommertialAgentFullName(user.name, user.lastName, user.secondLastName), user.userId), refetchOnWindowFocus: false});
  const handleRefresh = () => refetch();

  useEffect(()=>{
    if(isSuccess){}
        setData(sourceData);
  }, [isSuccess])

  const handleDelete = async (identifier: string) => {
        removeCotization(identifier).then(()=>{
          refetch();
        })  
  }

  const handleViewPdf = async (data: cotizationGeneralData) => {
    await cotization.setGeneralData(data);
    setOpenViewPDF(true);
  }

  const handleCotizationDetail = (data: cotizationGeneralData) => {
    dispatch(setCurrentCotization(data))
    dispatch(changeSection(2));
  }

  const handleDeleteMessage = (element: cotizationGeneralData ) => {
    setDeleteInfo(element.cotizationId);
    setWarnMessageOpen(true);
}
  const CustomCard = ({data}) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <>
        {/* {openViewPDF && (
            <Modal open={openViewPDF} onClose={()=>setOpenViewPDF(false)}>
                <PDFViewer width={800} height={700} showToolbar>
                    <GugaDocument 
                      generalData={cotization.generalData} 
                      equipments={cotization.equipments} 
                      prices={cotization.prices} 
                    />
                </PDFViewer>
            </Modal>
        )} */}
        <Card 
          onMouseOver={()=> setExpanded(true)} 
          onMouseOut={()=>setExpanded(false)}     
          elevation={4}
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' , 
          // minHeight: 160,
            borderRadius: 3,
            backgroundColor: '#F1F3F9',
            transition: 'transform 0.5s ease-in-out',
              '& .arrowSvg': {
                transition: '0.2s',
                transform: 'translateX(0) rotate(0)',
                },
              '&:hover': {
                '& .arrowSvg': {
                    transition: 'transform 0.2s ease-in-out',
                    transform: 'rotate(90deg)',
                }
              },
          }} 
        >
        <Grid container sx={{display: 'flex', alignItems: 'center'}}>
          <Grid item xs={10}>
            <CardContent >
              <Grid container spacing={2}>
                <Grid 
                  item 
                  xs={1.5}
                  sm={1.5}
                  md={1.5} 
                  sx={{
                    display:'flex',
                    alignItems:'center',
                    justifyContent: 'center'
                  }}
                >
                  <Avatar {...setAvatarProps(data.comercialAgent)}/>
                </Grid>

                <Grid item xs={10.5} sm={10.5} md={10.5} sx={{ marginTop: 1}}>
                  <Box>
                    <Typography variant="body2" color="black" fontSize={'1.26rem'}><b style={{color: darkBlueGrey}}>REFERENCIA: </b>{data.referenceNumber}</Typography>
                  </Box>
                  <Collapse in={expanded} >
                    <Typography variant="body2" color="black" fontSize={'.86rem'} sx={{mt: .5}}><b style={{color: darkBlueGrey}}>Fecha de creación: </b>{new Date(data.creationDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                    <Typography variant="body2" color="black" fontSize={'.86rem'} sx={{mt: .5}}><b style={{color: darkBlueGrey}}>Agente Comercial: </b>{data.comercialAgent}</Typography>
                    <Typography variant="body2" color="black" fontSize={'.86rem'} sx={{mt: .5}}><b style={{color: darkBlueGrey}}>Cliente: </b>{data.companyName}</Typography>
                    <Typography variant="body2" color="black" fontSize={'.86rem'} sx={{mt: .5}}><b style={{color: darkBlueGrey}}>Contacto: </b>{data.contactName}</Typography>
                  </Collapse>
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
          <Grid item sm={1.2} sx={{display: 'flex', flexDirection: 'row', textAlign: 'center', transition: '1.3s', alignItems: 'center', justifyContent: "end"}}>
            <Collapse in={expanded}>
              <CardActions disableSpacing sx={{display: 'flex', flexDirection: 'column', textAlign: 'center', transition: '1.3s', alignItems: 'center'}}>
                <IconButton sx={{justifyContent: 'center'}} onClick={()=>handleCotizationDetail(data)}>
                    <VisibilityIcon sx={{color: blueDark}}/>
                </IconButton>
                <IconButton sx={{justifyContent: 'center'}} onClick={()=>handleViewPdf(data)}>
                    <PictureAsPdfIcon sx={{color: blueDark}}/>
                </IconButton>
                <IconButton sx={{justifyContent: 'center'}} onClick={()=>handleDeleteMessage(data)}>
                    <DeleteIcon sx={{color: blueDark}}/>
                </IconButton>
              </CardActions>
            </Collapse>
          </Grid>
          <Grid item sm={.7} sx={{display: 'flex', justifyContent: 'center'}}>
            <Box className="arrowSvg" id="arrowSvg" sx={{
            }}>
              <ArrowForwardIosIcon/>
            </Box>
          </Grid>
        </Grid>
        </Card>
      </>
    )
  }
  return (
    <>
      <DocumentViewer
        open={openViewPDF}
        onClose={setOpenViewPDF}
        cotization={cotization}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Header>Cotizaciones</Header>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Box sx={{mt: 2, mb: 2,ml: 3, mr: 2, display:'flex',flexDirection:'row', justifyContent: 'space-between', color: 'white'}}>
              <EnhancedFilter
                 data={sourceData}
                 setDataFilter={setData}
              />
              <StyledButton variant="contained" startIcon={<RefreshIcon/>} sx={{ml: 2}} onClick={handleRefresh}>
                Refresh
              </StyledButton>
            </Box>
            <Box sx={{ml: 3, mr: 2}}>
              {!isFetching && isSuccess && !!data ?(
                <Grid container spacing={2}>
                  {data.map((element, index)=>(
                    <Grid item xs={12} sm={12} key={index}>
                      <CustomCard key={index} data = {element}/>
                    </Grid>
                  ))}
                </Grid>
              ):(
                <Box height="33vh" sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <CircularProgress color="secondary" />
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <WarnMessage
          visible={warnMessageOpen}
          setVisible={setWarnMessageOpen}
          onAgree={()=> {handleDelete(deleteInfo)}} 
      >
          <Typography variant="h5" textAlign={"center"}>¿Esta seguro que desea eliminar esta cotización?</Typography>
      </WarnMessage>
    </>
  )
}
export default HomePage;