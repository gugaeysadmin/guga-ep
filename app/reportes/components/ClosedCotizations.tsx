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

import { blueDark, blueLight, homeStyle, redWarn } from "../../Styles/general";
import { colorText } from "../../Styles/general";

import { setAvatarProps } from "../../hooks/setAvatarProps";
import { getAllCotization, getClosedCotization, getCotizationsOverview, getOpenCotization, removeCotization } from "../../services/cotizationService";

import {  StyledButton,
          Search,
          SearchIconWrapper,
          StyledInputBase,
} from "../../Styles/styledComponents/StyledComponents";
import { cotizationGeneralData } from "../../entities/cotization";
import Header from "../../components/Header";
import { PDFViewer } from "@react-pdf/renderer";
import GugaDocument from "../../documentPdf/GugaDocument";
import { useCotization } from "../../hooks/useCotization";
import { changeSection } from "../../reducer/sliceSections";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setCurrentCotization } from "../../reducer/sliceCurrentCotization";
import DocumentViewer from "../../documentPdf/DocumentViewer";
import EnhancedFilter from "../../components/EnhancedFilter";
import { WarnMessage } from "../../components/WarnMessage";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { StyledTable } from "../../components/Table";
import { cotizationReportColumns } from "../../catalogos/components/TableColumnConfiguration";
import { getCotizationRows } from "../../catalogos/components/TableRowConfiguration";
import { grey } from "@mui/material/colors";

const ClosedCotizations = () =>{
    const [warnMessageOpen, setWarnMessageOpen] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState("");
  const [openViewPDF, setOpenViewPDF] = useState(false);
  const [data, setData] = useState<cotizationGeneralData[]>();
  const cotization = useCotization();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state)=> state.sliceUserReducer.logIn);

  const {data: sourceData, isSuccess, isFetching, refetch} = useQuery<cotizationGeneralData[]>({queryKey: ["getClosedCotization"], queryFn: getClosedCotization, refetchOnWindowFocus: false});
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

  const handleViewPdf = async (id: string ) => {
    let cotizationData = sourceData.filter((element) => element.cotizationId === id)[0];
    await cotization.setGeneralData(cotizationData);
    setOpenViewPDF(true);
  }

  const handleCotizationDetail = (id: string ) => {
    let cotizationData = sourceData.filter((element) => element.cotizationId === id)[0];
    dispatch(setCurrentCotization(cotizationData))
    dispatch(changeSection(2));
  }

  const handleDeleteMessage = (id: string ) => {
    setDeleteInfo(id);
    setWarnMessageOpen(true);
  }

  const handleTableCollumns = (columnDefinitions: any) => {
    return [
        {
            field: "options",
            type: "actions",
            headerName: "Opciones",
            width: 150,
            cellClassName: "actions",
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        key={1}
                        icon={<DeleteIcon sx={{color: redWarn }}/>}
                        label= {"Eliminar"}
                        color="primary"
                        onClick = {() => handleDeleteMessage(id)}
                    />,
                    <GridActionsCellItem
                        key={2}
                        icon={<PictureAsPdfIcon sx={{color: blueLight }}/>}
                        label= {"Ver pdf"}
                        color="primary"
                        onClick = {() => handleViewPdf(id)}
                    />,
                    <GridActionsCellItem
                        key={2}
                        icon={<VisibilityIcon sx={{color: 'grey'}}/>}
                        label= {"Ver"}
                        color="primary"
                        onClick = {() => handleCotizationDetail(id)}
                    />,
                ]
            },

        },
        ...columnDefinitions
    ]
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
                  <StyledTable
                    columns={handleTableCollumns(cotizationReportColumns)}
                    rows={getCotizationRows(data)}
                  />
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

export default ClosedCotizations;
