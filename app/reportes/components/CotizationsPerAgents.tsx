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
import { CotizationsPerAgentsColumns, cotizationReportColumns } from "../../catalogos/components/TableColumnConfiguration";
import { getCotizationRows, getCotizationsPerAgens } from "../../catalogos/components/TableRowConfiguration";
import { grey } from "@mui/material/colors";
import { commercialAgents } from "@/app/entities/domains";
import { getCommercialAgents } from "@/app/services/catalogServices";

const CotizationsPerAgents = () =>{
    const [warnMessageOpen, setWarnMessageOpen] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState("");
  const [openViewPDF, setOpenViewPDF] = useState(false);
  const [data, setData] = useState<commercialAgents[]>();
  const cotization = useCotization();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state)=> state.sliceUserReducer.logIn);

  const {data: sourceData, isSuccess, isFetching, refetch} = useQuery<commercialAgents[]>({queryKey: ["getCommercialAgents"], queryFn: getCommercialAgents, refetchOnWindowFocus: false});
  const handleRefresh = () => refetch();

  useEffect(()=>{
    if(isSuccess){}
        setData(sourceData);
  }, [isSuccess])


  const handleTableCollumns = (columnDefinitions: any) => {
    return [
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
                    columns={handleTableCollumns(CotizationsPerAgentsColumns)}
                    rows={getCotizationsPerAgens(data)}
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
    </>
  )
}

export default CotizationsPerAgents;