'use client'
import React, {useState, useEffect} from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form"


import { PDFViewer } from "@react-pdf/renderer";

import {    Box,
            Grid,
            Paper,
            Typography,
            Table,
            TableBody,
            TableCell,
            TableContainer,
            TableHead,
            TablePagination,
            TableRow,
            tableCellClasses,
            styled,
            TextField,
            Button,
            Modal,
            MenuItem,
            Autocomplete,
            Divider,
 } from "@mui/material";

 import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SaveIcon from '@mui/icons-material/Save';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';

import { blueDark, blueLight, colorTextWhite, homeStyle, redWarn, sidebarColor } from "../Styles/general";
import { colorText } from "../Styles/general";
import {    StyledTableCell,
            StyledTableRow,
            StyledTextField,
            StyledButton,
            ActionStyledButton,
} from "../Styles/styledComponents/StyledComponents";
import NewItem from "./components/NewItem";
import GugaDocument from "../documentPdf/GugaDocument";
import { cotizationEquipment, cotizationGeneralData, cotizationsPrices, finalStatement } from "../entities/cotization";
import { ValidationPatterns } from "../entities/rules";
import { comertialConditions } from "../entities/cotization";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { closeCotization, closeCotizationData, generateReferenceNumber, getCotizationNumber, saveCotization, updateCotization } from "../services/cotizationService";
import Header from "../components/Header";
import ModalConfirmation from "../catalogos/components/ConfirmationModal";
import { StyledTable } from "../components/Table";
import { cotizationEquipmentColumns } from "../catalogos/components/TableColumnConfiguration";
import { useCotization } from "../hooks/useCotization";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { resetCurrentCotization } from "../reducer/sliceCurrentCotization";
import { getClients, getCommercialAgents, getEquipments } from "../services/catalogServices";
import { clients, commercialAgents, referenceEquipment } from "../entities/domains";
import { CLIENT_STATIC_FILES_PATH } from "next/dist/shared/lib/constants";
import { GridActionsCellItem } from "@mui/x-data-grid";

//import { NumericFormat, NumericFormatProps } from 'react-number-format';

import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { blueGrey } from "@mui/material/colors";
import DocumentViewer from "../documentPdf/DocumentViewer";
import { handleCommertialAgentFullName } from "../catalogos/components/TableRowConfiguration";
import { format } from "path";
import { FilePresent } from "@mui/icons-material";



function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const NewCotization = () => {

    const [isNew, setIsNew] = useState(true);
    const [isClosed, setIsClosed] = useState(false);
    const [openNewItem, setOpenNewItem] = useState(false);
    const [openViewPDF, setOpenViewPDF] = useState(false);
    const [isCotizating, setIsCotizating] = useState(false);
    const [openModalConfirmation, setOpenModalConfirmation] = useState(false);
    const [openModalConfirmationClose, setOpenModalConfirmationClose] = useState(false);
    const [openModalConfirmationUpdate, setOpenModalConfirmationUpdate] = useState(false);
    const [openModalRecotization, setOpenModalRecotization] = useState(false);
    const [clientList, setClientList] = useState<string[]>([""]);
    const [contacts, setContacts] = useState<clients[]>([]);
    const [isNoEquipment, setIsNoEquipment] = useState(false);

    const queryClient = useQueryClient();


    const cotization = useCotization();
    const [equipmentData, setEquipmentData] = useState<cotizationEquipment>();
    const [cotizationIsValid, setCotizationIsValid] = useState(false);
    
    const {register, formState: { errors, isValid },watch,trigger, reset, getValues, handleSubmit,setValue, control} =  useForm<cotizationGeneralData>({mode: "all"})
    const saveGeneralData = useMutation({mutationKey:["saveGeneralData"], mutationFn: (data: cotizationGeneralData)=> saveCotization(data)});
    const closeGeneralData = useMutation({mutationKey:["closeGeneralData"], mutationFn: (data: closeCotizationData)=> closeCotization(data)});
    const updateGeneralData = useMutation({mutationKey:["updateGeneralData"], mutationFn: (data: cotizationGeneralData)=> updateCotization(data)});
    const cotizationNumberId = useQuery({queryKey:["getCotizationNumber"], queryFn: getCotizationNumber, refetchOnWindowFocus: false, enabled: false});
    const clients = useQuery({queryKey:["getClients"], queryFn: getClients, refetchOnWindowFocus: false});
    const commercialAgents = useQuery({queryKey:["getCommercialAgents"], queryFn: getCommercialAgents, refetchOnWindowFocus: false});



    const existentData = useAppSelector((state) => state.sliceCurrentCotizationReducer.data);
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state)=>state.sliceUserReducer.logIn);

    var formatter = new Intl.NumberFormat(
        'es-MX', {
            style: 'currency',
            currency: 'MXN',
    });

    useEffect(()=> {
        if(clients.isSuccess){
            let refSet = new Set(clientList);

            clients.data.map((item: clients) => {
                refSet.add(item.companyName)
            })
            setClientList(Array.from(refSet));

            if(!!equipmentData &&typeof equipmentData !== null)
                handleClient(equipmentData.reference);
        }
    },[clients.isSuccess])

    useEffect(()=>{
        if(!!existentData ){
            reset(existentData);
            cotization.setEquipments(existentData.equipmentAsociated);
            setIsNew(false);
            setIsClosed(existentData.isClosed);
        }else {
            reset();
            cotizationNumberId.refetch();
            setValue("comercialAgent",handleCommertialAgentFullName(currentUser.name, currentUser.lastName, currentUser.secondLastName));
            setValue("comercialAgentId",currentUser.userId);
            setValue("creationDate", new Date().toISOString().split("T")[0]);
            setValue("isClosed", false);
            setContacts([]);
        }
        return () => {
            reset();
            setValue("referenceNumber", "");
            dispatch(resetCurrentCotization());
            queryClient.removeQueries({
                queryKey: ["getCotizationNumber"]
            });
        }
    },[])

    useEffect(()=>{
        const disc = getValues("discount");
        if(!isNaN(disc))
            cotization.setDiscount(disc);
        else
            cotization.setDiscount(0);
    },[watch("discount")])

    useEffect(()=>{
        if(cotizationNumberId.isSuccess && isNew ){
            setValue("referenceNumber", generateReferenceNumber(cotizationNumberId.data));
            setValue("referenceNumberId", cotizationNumberId.data);
            if(isCotizating){
                const recotData = getValues();
                saveGeneralData.mutate(recotData)
                setIsCotizating(false);
                setIsNew(false)
            }
        }
    },[cotizationNumberId.isSuccess])

    useEffect(()=>{
        if(saveGeneralData.isSuccess && !!!existentData){
            setIsNew(false);
            setValue("cotizationId", saveGeneralData.data.cotizationId);
        }
    },[saveGeneralData.isSuccess])

    useEffect(()=> {
        if(closeGeneralData.isSuccess)
            setIsClosed(true);
    }, [closeGeneralData.isSuccess])
    
    useEffect(()=>{
        if(isValid){
            if(!!cotization.equipments)
                (cotization.equipments.length > 0)? setCotizationIsValid(true): setCotizationIsValid(false)

        }

    },[isValid, cotization.equipments])

    useEffect(()=>{
        if(!openNewItem) setEquipmentData(null);
    },[openNewItem])

    const handleClient = (ref: string) => {
        let refData = clients.data.filter((item: clients) => item.companyName.toLowerCase() === ref.toLowerCase());
        setContacts(refData);
        if(refData.length <= 1 && refData.length > 0){
            if(!!refData[0].companyDirection)
                setValue("address", refData[0].companyDirection);
            if(!!refData[0].contactName)
                setValue("contactName", refData[0].contactName);
            if(!!refData[0].contactPhone)
                setValue("cellphone", refData[0].contactPhone);
            if(!!refData[0].contactEmail) 
                setValue("email", refData[0].contactEmail);
        }
    }
    const handleOpenNewItem = () => (openNewItem) ? setOpenNewItem(false) : setOpenNewItem(true);
    
    const addNewEquipment = async (data: cotizationEquipment) => {
        const idAlreadyExist = cotization.equipments.findIndex(equipment => equipment.id === data.id);

        if(idAlreadyExist !== -1){
            let aux = [...cotization.equipments];
            aux[idAlreadyExist] = {
                amount: data.amount,
                description: data.description,
                id: data.id,
                item: data.item,
                reference: data.reference,
                totalPrice: data.totalPrice,
                unit: data.unit,
                unitPrice: data.unitPrice,
                code: data.code
            };
            cotization.setEquipments(aux);
        }else{
            data.id = (!!cotization.equipments)? cotization.equipments.length + 1 : 1;
            await cotization.setDiscount(getValues("discount"));
            await cotization.setEquipments([
                ...cotization.equipments,
                data
            ])
        }        
    }
    
    const handleGeneratePdf = async () => {
        const data = getValues();
        data.equipmentAsociated = cotization.equipments;
        await cotization.setGeneralData(data);
        setOpenViewPDF(true);
    }

    const onSubmit = async (data: cotizationGeneralData) => {
        data.equipmentAsociated = cotization.equipments;
        if(isNew){
            saveGeneralData.mutate(data);
            setOpenModalConfirmation(true);
        }
        else {
            updateGeneralData.mutate(data);
            setOpenModalConfirmationUpdate(true);
        }
    }

    const handleRecotize = (data: cotizationGeneralData) =>  {
        // data.equipmentAsociated = cotization.equipments;
        // if(data.equipmentAsociated.length === 0){
        //     setIsNoEquipment(true);
        //     trigger();
        //     return;
        // }

        // let closeData: closeCotizationData = {
        //     isNew: isNew,
        //     newData: data,
        //     totalPrice: cotization.prices.total,
        // }
        // closeGeneralData.mutate(closeData);
        // setOpenModalConfirmationClose(true);
        setIsNew(true);
        setIsCotizating(true);
        cotizationNumberId.refetch();
        setOpenModalRecotization(true)
    }   

    const handleDeleteEquipment = (id: number) => {
        cotization.setEquipments(
            cotization.equipments.filter(element => element.id !== id)
        )
    }

    const handleEditEquipment = (id: number) => {
        setEquipmentData(
            cotization.equipments.filter(element => element.id === id)[0]
        )
        setOpenNewItem(true);
    }

    const handleTableCollumns = (columnDefinitions: any) => {
        if(!isClosed)
        return [
            {
                field: "options",
                type: "actions",
                headerName: "Opciones",
                width: 100,
                cellClassName: "actions",
                getActions: ({ id }) => {
                    return [
                        <GridActionsCellItem
                            key={1}
                            icon={<DeleteIcon sx={{color: redWarn}}/>}
                            label= {"Eliminar"}
                            color="primary"
                            disabled={isClosed}
                            onClick = {() => handleDeleteEquipment(id)}
                        />,
                        <GridActionsCellItem
                            key={2}
                            icon={<EditNoteIcon/>}
                            label= {"Editar"}
                            color="primary"
                            disabled={isClosed}
                            onClick = {() => handleEditEquipment(id)}
                        />,
                    ]
                },

            },
            ...columnDefinitions
        ]
        else 
        return [
            ...columnDefinitions
        ]
    }

    const validatePercentage = (value: string) => {
        const  num = parseFloat(value);
    
        if (isNaN(num) || num < 0) return 0;
        else if (num > 100) return 100;
        else
        return num;
    };
    return (
        <>
            {/*
                    <Controller
                        name=""
                        control={control}
                        defaultValue=""
                        rules={{
                        }}
                        render={({field})=>(
                        )}
                    />

                    value={field.value}
                    onChange={(data)=>{
                        setValue("repeatPassword",data.target.value)
                    }}
        
            */}

            <DocumentViewer
                open={openViewPDF}
                onClose={setOpenViewPDF}
                cotization={cotization}
            />
            {/* {openViewPDF && (
                <Modal open={openViewPDF} onClose={setOpenViewPDF}>
                    <PDFViewer width={800} height={700} showToolbar>
                        <GugaDocument 
                            generalData={cotization.generalData} 
                            equipments={cotization.equipments} 
                            prices={cotization.prices} 
                        />
                    </PDFViewer>
                </Modal>
            )} */}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {isNew?(
                        <Header>Nueva Cotización</Header>
                    ):(
                        <Header>Cotización {getValues("referenceNumber")}</Header>
                    )}
                </Grid>
                <Grid item xs={12}>
                    <Box
                        component = "form"  
                        noValidate 
                        autoComplete = "off"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {/* Form */}
                        <Box sx={{ml: 3, mr: 2, mb: 5, mt: 2}}>
                            <Grid container spacing={2} >

                                {/* Nombre */}
                                <Grid item xs={12} sm={4} md={4}>
                                    <Controller
                                        control={control}
                                        name="companyName"
                                        defaultValue=""
                                        rules={{
                                            required: "Campo requerido",
                                            pattern: {
                                                value: ValidationPatterns.openText.pattern,
                                                message: ValidationPatterns.openText.errorMessage,
                                            },
                                        }}
                                        render={({ field: { onChange, value } })=>(
                                            <Autocomplete
                                                options={clientList}
                                                getOptionLabel={(option: string)=>option}
                                                inputValue={value}
                                                onInputChange={(event, item)=>{
                                                    setValue("companyName", item);
                                                    handleClient(item);
                                                }}
                                                clearOnEscape = {false}
                                                clearOnBlur = {false}
                                                renderInput={(props)=>(
                                                    <TextField
                                                        {...props}
                                                        label="Cliente"
                                                        placeholder="Ingresar nombre de la empresa u hospital" 
                                                        variant="filled" 
                                                        required
                                                        disabled={isClosed}
                                                        error = {!!errors?.companyName}
                                                        helperText = {errors?.companyName?.message || ""}
                                                        fullWidth
                                                    />
                                                )}
                                            />
                                        )}
                                    /> 

                                    {/* <Autocomplete
                                        options={!!clients.data? clients.data: []}
                                        getOptionLabel={(option: clients)=>option.companyName}
                                        onChange={(event, item) => {
                                            if(!!item){
                                                setValue("address", item.companyDirection);
                                                setValue("contactName", item.contactName);
                                                setValue("cellphone", item.contactPhone);
                                                setValue("email", item.contactEmail);
                                            }
                                        }}
                                        inputValue={"hola"}
                                        onInputChange={(event, value)=>{
                                            setValue("companyName", value);
                                        }}
                                        disablePortal
                                        renderInput={(props)=>(
                                            <TextField
                                                {...props}
                                                label="Cliente"
                                                placeholder="Ingresar nombre de la empresa u hospital" 
                                                variant="filled" 
                                                required
                                                error = {!!errors?.companyName}
                                                helperText = {errors?.companyName?.message || ""}
                                                fullWidth
                                            />
                                        )}
                                    /> */}
                                </Grid> 
                                
                                {/* Cliente */}
                                <Grid item xs={12} sm={4} md={4}>
                                    <Controller
                                        name="contactName"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: "Campo requerido",
                                            pattern: {
                                                value: ValidationPatterns.onlyText.pattern,
                                                message: ValidationPatterns.onlyText.errorMessage
                                            }
                                        }}
                                        render={({field: {value}})=>(
                                            <Autocomplete
                                                options={contacts}
                                                getOptionLabel={(option: clients) => `${option.contactName}`}
                                                inputValue={value}
                                                sx={{
                                                    '& .MuiAutocomplete-clearIndicator': {
                                                        color: colorTextWhite,
                                                    },
                                                    '& .MuiAutocomplete-popupIndicator': {
                                                        color: colorTextWhite,
                                                    }
                                                }}
                                                onInputChange={(event, item)=>{
                                                    setValue("contactName", item);
                                                }}
                                                onChange={(event, item) => {
                                                    if(!!item){
                                                        if(!!item.companyDirection)
                                                            setValue("address", item.companyDirection);
                                                        if(!!item.contactPhone)
                                                            setValue("cellphone", item.contactPhone);
                                                        if(!!item.contactEmail) 
                                                            setValue("email", item.contactEmail);
                                                    }
                                                }}
                                                clearOnEscape = {false}
                                                clearOnBlur = {false}
                                                renderInput={(props)=>(
                                                    <TextField
                                                        {...props}
                                                        label="Contacto"
                                                        placeholder="Ingresar nombre de cotacto" 
                                                        error = {!!errors?.contactName}
                                                        helperText = {errors?.contactName?.message || ""}
                                                        variant="filled" 
                                                        required
                                                        fullWidth
                                                        disabled={isClosed}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid> 
                                
                                {/* Teléfono */}
                                <Grid item xs={12} sm={2} md={2}>
                                    <Controller
                                        name="cellphone"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: "Campo requerido",
                                            pattern: {
                                                value: ValidationPatterns.openText.pattern,
                                                message: ValidationPatterns.openText.errorMessage
                                            }
                                        }}
                                        render={({field})=>(
                                            <TextField
                                                label="Teléfono" 
                                                error = {!!errors?.cellphone}
                                                helperText = {errors?.cellphone?.message || ""}
                                                placeholder="Ingresar teléfono"
                                                variant="filled" 
                                                fullWidth
                                                required
                                                disabled={isClosed}
                                                value={field.value}
                                                onChange={(data)=>{
                                                    setValue("cellphone",data.target.value)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid> 

                                {/* Fecha */}
                                <Grid item xs={12} sm={2} md={2}>
                                    <Controller
                                        name="creationDate"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: "Campo requerido"
                                        }}
                                        render={({field})=>(
                                            <TextField
                                                label="Fecha"
                                                error = {!!errors?.creationDate}
                                                helperText = {errors?.creationDate?.message || ""}
                                                placeholder="Ingresar fecha" 
                                                variant="filled" 
                                                type="date"
                                                defaultValue={new Date().toString()}
                                                InputLabelProps={{ shrink: true }}  
                                                fullWidth
                                                disabled={isClosed}
                                                required
                                                value={field.value}
                                                onChange={(data)=>{
                                                    setValue("creationDate",data.target.value)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid> 

                                {/* Ciudad */}
                                <Grid item xs={12} sm={4} md={4}>
                                    <Controller
                                        name="city"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: "Campo requerido",
                                            pattern: {
                                                value: ValidationPatterns.openText.pattern,
                                                message: ValidationPatterns.openText.errorMessage,
                                            },
                                        }}
                                        render={({field})=>(
                                            <TextField
                                                label="Ciudad"
                                                placeholder="Ingresar ciudad del cliente" 
                                                error = {!!errors?.city}
                                                helperText = {errors?.city?.message || ""}
                                                variant="filled" 
                                                fullWidth
                                                required
                                                disabled={isClosed}
                                                value={field.value}
                                                onChange={(data)=>{
                                                    setValue("city",data.target.value)
                                                }}
        
                                            />
                                        )}
                                    />
                                </Grid> 
                                
                                {/* Dirección */}
                                <Grid item xs={12} sm={8} md={8}>
                                    <Controller
                                        name="address"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: "Campo requerido",
                                            pattern: {
                                                value: ValidationPatterns.openText.pattern,
                                                message: ValidationPatterns.openText.errorMessage,
                                            },
                                        }}
                                        render={({field})=>(
                                            <TextField
                                                label="Dirección"
                                                placeholder="Ingresar dirección del cliente" 
                                                error = {!!errors?.address}
                                                helperText = {errors?.address?.message || ""}
                                                variant="filled" 
                                                fullWidth
                                                required
                                                disabled={isClosed}
                                                value={field.value}
                                                onChange={(data)=>{
                                                    setValue("address",data.target.value)
                                                }}
        
                                            />
                                        )}
                                    />
                                </Grid> 
                                
                                {/* E-mail */}
                                <Grid item xs={12} sm={4} md={4}>
                                    <Controller
                                        name="email"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: "Campo requerido",
                                            pattern: {
                                                value: ValidationPatterns.email.pattern,
                                                message: ValidationPatterns.email.errorMessage
                                            }
                                        }}
                                        render={({field})=>(
                                            <TextField
                                                error = {!!errors?.email}
                                                helperText = {errors?.email?.message || ""}
                                                label="E-mail" 
                                                placeholder="Ingresar E-mail del ciente"
                                                variant="filled" 
                                                fullWidth
                                                required
                                                disabled={isClosed}
                                                value={field.value}
                                                onChange={(data)=>{
                                                    setValue("email",data.target.value)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid> 
                                
                                {/* Descuento */}
                                <Grid item xs={12} sm={2} md={2}>
                                    <Controller
                                        name="discount"
                                        control={control}
                                        defaultValue={0}
                                        rules={{
                                            required: "Campo requerido",
                                            min: {value: 0.0, message: "No puede ser menor que 0"},
                                            max: {value: 100.0, message: "No puede ser mayor que 100"},
                                        }}
                                        render={({field})=>(
                                            <TextField
                                                error = {!!errors?.discount}
                                                helperText = {errors?.discount?.message || ""}
                                                //defaultValue = {0.0}
                                                // label="Descuento" 
                                                // inputProps={{
                                                //     maxLength: 6, // Permite hasta 100.00
                                                //     type: "number",
                                                //     step: "0.01",
                                                //     min: "0",
                                                //     max: "100",
                                                //   }}


                                                
                                                placeholder="Ingresar descuento"
                                                disabled={isClosed}
                                                variant="filled" 
                                                type="number"
                                                fullWidth
                                                required
                                                InputLabelProps={{
                                                    style: {
                                                        color: colorTextWhite
                                                    }
                                                }}
                                                inputProps={{step: 1, min: 0}}
                                                value={field.value}
                                                onChange={(data)=>{
                                                    const value = parseFloat(data.target.value);
                                                    if (value > 100) {
                                                        setValue("discount",100)
                                                    } else
                                                    setValue("discount",value)
                                                }}
                                                // type = "number"
                                                // value={field.value}
                                                // onChange={(e) => {
                                                //     const value = validatePercentage(e.target.value);
                                                //     field.onChange(value);
                                                // }}
                                                // onBlur={(e) => {
                                                //     const value = validatePercentage(e.target.value);
                                                //     field.onChange(value);
                                                // }}
                                                // inputProps={{ step: '1.0' }}
                                            />
                                        )}
                                    />
                                </Grid> 
                                
                                {/* Moneda */}
                                <Grid item xs={12} sm={2} md={2}>
                                    <TextField
                                        {...register("currency")}
                                        error = {!!errors?.currency}
                                        helperText = {errors?.currency?.message || ""}
                                        label="Moneda" 
                                        defaultValue={"M.N."}
                                        select
                                        required
                                        disabled={isClosed}
                                        placeholder="Tipo de moneda"
                                        variant="filled" 
                                        fullWidth
                                    >
                                        <MenuItem value="M.N.">
                                            M.N.
                                        </MenuItem>
                                        <MenuItem value="USD">
                                            USD
                                        </MenuItem>
                                    </TextField>
                                </Grid>
                                
                                {/* Referencia */}
                                <Grid item xs={12} sm={4} md={4}>
                                    <Controller
                                        name="referenceNumber"
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: "Campo requerido"
                                        }}
                                        render={({field})=>(
                                            <TextField
                                                error = {!!errors?.referenceNumber}
                                                helperText = {errors?.referenceNumber?.message || ""}
                                                label="Referencia" 
                                                placeholder="Núm. de referencia"
                                                variant="filled" 
                                                fullWidth
                                                disabled={isClosed}
                                                required
                                                value={field.value}
                                                onChange={(data)=>{
                                                    setValue("referenceNumber",data.target.value)
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Agente comercial */}
                                <Grid item xs={12} sm={4} md={4}>
                                    <Controller
                                        control={control}
                                        name="comercialAgent"
                                        defaultValue=""
                                        rules={{
                                            required: "Campo requerido",
                                            pattern: {
                                                value: ValidationPatterns.onlyText.pattern,
                                                message: ValidationPatterns.onlyText.errorMessage
                                            }
                                        }}
                                        render={({field: {value}})=>(
                                            <Autocomplete
                                                options={!!commercialAgents.data? commercialAgents.data : []}
                                                getOptionLabel={(option: commercialAgents) => handleCommertialAgentFullName(option.names, option.firstLastName, option.secondLastName)}
                                                inputValue={value}
                                                onInputChange={(event, input)=>{
                                                    setValue("comercialAgent", input);
                                                    let commercialAgent = commercialAgents.data.find((agent)=> handleCommertialAgentFullName(agent.names, agent.firstLastName, agent.secondLastName) === input);
                                                    if(!!commercialAgent)
                                                        setValue("comercialAgentId",commercialAgent.agentId)
                                                }}
                                                clearOnEscape = {false}
                                                clearOnBlur = {false}
                                                disabled = {isClosed || !currentUser.isAdmin} 
                                                renderInput={(props)=>(
                                                    <TextField
                                                        {...props}
                                                        error = {!!errors?.comercialAgent}
                                                        helperText = {errors?.comercialAgent?.message || ""}
                                                        label="Agente comercial" 
                                                        placeholder="Nombre del agente comercial"
                                                        variant="filled" 
                                                        disabled={isClosed || !currentUser.isAdmin}
                                                        fullWidth
                                                        required
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>
                                
                                {/* Condiciones Comerciales */}
                                <Grid item xs={12} mt={5}>
                                    <TextField
                                        {...register("comercialConditions", {
                                            required: "Campo requerido",
                                        })}
                                        error = {!!errors?.comercialConditions}
                                        helperText = {errors?.comercialConditions?.message || ""}
                                        defaultValue={comertialConditions}
                                        label="Condiciones Comerciales"
                                        placeholder="Ingresar condiciones comerciales" 
                                        variant="filled" 
                                        multiline
                                        disabled={isClosed}
                                        rows={4}
                                        fullWidth
                                    />
                                </Grid>

                                {/* Mensaje de despedida mensaje de despedida */}
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("finalStatment", {
                                            required: "Campo requerido",
                                        })}
                                        error = {!!errors?.finalStatment}
                                        helperText = {errors?.finalStatment?.message || ""}
                                        defaultValue={finalStatement}
                                        label="Mensaje de despedida"
                                        placeholder="Ingresar mensaje de despedida" 
                                        variant="filled" 
                                        disabled={isClosed}
                                        multiline
                                        rows={2}
                                        fullWidth
                                    />
                                </Grid>
                       
                                {/* Observaciones */}
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("observations", {
                                            required: false,
                                        })}
                                        error = {!!errors?.observations}
                                        helperText = {errors?.observations?.message || ""}
                                        defaultValue={""}
                                        label="Observaciones"
                                        placeholder="Ingresar observaciones" 
                                        disabled={isClosed}
                                        variant="filled" 
                                        multiline
                                        rows={2}
                                        fullWidth
                                    />
                                </Grid>

                            </Grid>
                        </Box>
                        {/* Buttons */}
                        <Grid 
                            container 
                            spacing={3}
                            sx={{
                                pl: 3,
                                pr: 1.5,
                            }}>
         
                            <Grid item xs={12} md={5}>
                                <Box>
                                    <Grid container>
                                        <Grid item xs={12} md = {6}>
                                            <StyledButton 
                                                variant="contained" 
                                                startIcon={<AddCircleIcon/>}
                                                onClick={handleOpenNewItem}
                                                fullWidth
                                                disabled={isClosed}
                                            >
                                                Agregar Equipo
                                            </StyledButton>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={7}>
                                <Box>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={4}>
                                            <StyledButton variant="contained" startIcon={<SaveIcon/>} disabled={isClosed} fullWidth onClick={()=>{onSubmit(getValues())}}>
                                                Guardar
                                            </StyledButton>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <StyledButton variant="contained" startIcon={<PictureAsPdfIcon/>} fullWidth onClick={() => {handleGeneratePdf()}}>
                                                Generar PDF
                                            </StyledButton>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <ActionStyledButton variant="outlined" startIcon={<HistoryEduIcon/>} disabled={isClosed || isNew} fullWidth onClick={handleSubmit(handleRecotize)}>
                                               Recotizar
                                            </ActionStyledButton>
                                        </Grid>
                                    </Grid>
                                </Box>

                            </Grid>


                        </Grid>
                        <Box sx={{display: "flex", justifyContent: "center", mt: 1, mb: 2}}>
                            <Divider sx={{width: "95%", borderBottom: .7, borderColor: blueDark}}/>
                        </Box>
                        {/* Table */}
                        <Box sx={{ml: 3, mr: 2, mb: 5}}>
                            {!!cotization.equipments ?(<>
                                {cotization.equipments.length > 0 ? (<>
                                    <StyledTable
                                        columns={handleTableCollumns(cotizationEquipmentColumns)}
                                        rows={cotization.equipments}
                                    />
                                </>):(<></>)}
                            </>) : (<></>)}
                        </Box>
                        {!!cotization.equipments && cotization.equipments.length > 0 &&
                            <Box sx={{ml: 3, mr: 2, mb: 5,display:"flex", justifyContent: "flex-end"}}>
                                <Table sx={{ minWidth: 300, maxWidth: 400, border: 1, borderColor: "lightgray" }} size="small" aria-label="a dense table">
                                    <TableRow hover>
                                        <TableCell variant="head" sx={{color: colorTextWhite, backgroundColor: blueLight}}> 
                                            <Typography variant="subtitle2">Importe</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>$</span> 
                                                <span>{formatter.format(cotization.prices.amount).replace("$","")}</span>
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow hover>
                                        <TableCell variant="head" sx={{color: colorTextWhite, backgroundColor: blueLight}}>
                                            <Typography variant="subtitle2">Descuento</Typography>
                                        </TableCell>
                                        <TableCell sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>$</span> 
                                            <span>{formatter.format(cotization.prices.discount).replace("$","")}</span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow hover>
                                        <TableCell variant="head" sx={{color: colorTextWhite, backgroundColor: blueLight}}>
                                            <Typography variant="subtitle2">% Subtotal</Typography>
                                        </TableCell>
                                        <TableCell sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>$</span>
                                            <span>{formatter.format(cotization.prices.subtotal).replace("$","")}</span>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow hover>
                                        <TableCell variant="head" sx={{color: colorTextWhite, backgroundColor: blueLight}}>
                                            <Typography variant="subtitle2">Iva (16%)</Typography>
                                        </TableCell>
                                        <TableCell sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>$</span> 
                                            <span>{formatter.format(cotization.prices.iva).replace("$","")}</span>
                                            </TableCell>
                                    </TableRow>
                                    <TableRow hover>
                                        <TableCell variant="head" sx={{color: colorTextWhite, backgroundColor: blueLight}}>
                                            <Typography variant="subtitle2">TOTAL</Typography>
                                        </TableCell>
                                        <TableCell sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: "bold" }}>
                                            <span>$</span>
                                            <span>{formatter.format(cotization.prices.total).replace("$","")}</span>
                                            
                                        </TableCell>
                                    </TableRow>
                                </Table>
                            </Box>
                        }
                    </Box>
                </Grid>
            </Grid>

            {/* NewItemDrawer */}
            <NewItem
                open={openNewItem}
                handleOpen={handleOpenNewItem}
                handleNewEquipment={addNewEquipment}
                equipmentData={equipmentData}
            />
            
            <ModalConfirmation
                visible = {openModalConfirmation}
                setVisible={setOpenModalConfirmation}
                isLoading = {!saveGeneralData.isSuccess && !saveGeneralData.isError}
                success = {saveGeneralData.isSuccess}
                hasButton = {true}
            >
                <Typography justifyContent={"center"} align="center">
                    La Cotización se ha guardado correctamente
                </Typography>
            </ModalConfirmation>
            <ModalConfirmation
                visible = {openModalRecotization}
                setVisible={setOpenModalRecotization}
                isLoading = {!cotizationNumberId.isSuccess && !cotizationNumberId.isError}
                success = {cotizationNumberId.isSuccess}
                hasButton = {false}
            >
                <Typography justifyContent={"center"} align="center">
                    Recotizando
                </Typography>
            </ModalConfirmation>
            <ModalConfirmation
                visible = {openModalConfirmationUpdate}
                setVisible={setOpenModalConfirmationUpdate}
                isLoading = {!updateGeneralData.isSuccess && !updateGeneralData.isError}
                success = {updateGeneralData.isSuccess}
                hasButton = {true}
            >
                <Typography justifyContent={"center"} align="center">
                    La Cotización se ha actualizado correctamente
                </Typography>
            </ModalConfirmation>
            <ModalConfirmation
                visible = {openModalConfirmationClose}
                setVisible={setOpenModalConfirmationClose}
                isLoading = { !closeGeneralData.isSuccess && !closeGeneralData.isError}
                success = {closeGeneralData.isSuccess}
                hasButton = {true}
            >
                <Typography justifyContent={"center"} align="center">
                    La Cotización se ha cerrado correctamente
                </Typography>
            </ModalConfirmation>
            <ModalConfirmation
                visible = {isNoEquipment}
                setVisible={setIsNoEquipment}
                isLoading = {false}
                success = {false}
                hasButton = {true}
                errorMessage = "No hay equipos agregados."
            >
                <Typography justifyContent={"center"} align="center">
                    No hay equipos agregados.
                </Typography>
            </ModalConfirmation>
        </>
    )
}

export default NewCotization;