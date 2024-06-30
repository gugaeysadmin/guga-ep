import { GridColDef } from "@mui/x-data-grid";

export const clientTableColumns: GridColDef[] =[
    {
        field: "companyName",
        headerName: "Empresa",
        width: 180,
    },{
        field: "companyDirection",
        headerName: "Direccion",
        width: 400,
    },{
        field: "contactName",
        headerName: "Contacto",
        width: 300,
    },{
        field: "contactEmail",
        headerName: "Email del contacto",
        width: 300,
    },{
        field: "contactPhone",
        headerName: "Teléfono 1",
        width: 150,
    },{
        field: "contactSecondPhone",
        headerName: "Teléfono 2",
        width: 150,
    }
] 

export const commercialAgentsColums: GridColDef[] =[
    {
        field: "fullName",
        headerName: "Nombre",
        width: 300,
    },{
        field: "numCotizations",
        headerName: "Cotizaciones",
        width: 130,
    },{
        field: "role",
        headerName: "Rol",
        width: 300,
    },{
        field: "email",
        headerName: "Email",
        width: 300,
    },{
        field: "phone",
        headerName: "Teléfono",
        width: 150,
    },{
        field: "secondPhone",
        headerName: "Teléfono 2",
        width: 150,
    }
] 

export const CotizationsPerAgentsColumns: GridColDef[] =[
    {
        field: "fullName",
        headerName: "Nombre",
        width: 300,
    }
    // ,{
    //     field: "email",
    //     headerName: "Email",
    //     width: 300,
    // }
    ,{
        field: "numCotizations",
        headerName: "Cotizaciones",
        width: 130,
    }
] 

export const referenceEquipmentColums: GridColDef[] =[
    {
        field: "codeNumber",
        headerName: "Código",
        width: 150,
    },{
        field: "name",
        headerName: "Categoría",
        width: 250,
    },{
        field: "brand",
        headerName: "Marca",
        width: 150,
    },{
        field: "description",
        headerName: "Descripción",
        width: 300,
    },
    // {
    //     field: "price",
    //     headerName: "Precio",
    //     width: 100,
    // }
] 

var formatter = new Intl.NumberFormat(
    'es-MX', {
        style: 'currency',
        currency: 'MXN',
});

export const cotizationEquipmentColumns: GridColDef[] =[
    // {
    //     field: "item",
    //     headerName: "Item",
    //     width: 80,
    // },
    {
        field: "reference",
        headerName: "Referencia",
        width: 100,
    },{
        field: "code",
        headerName: "Código",
        width: 100,
    },{
        field: "description",
        headerName: "Descripción",
        width: 400,
    },{
        field: "amount",
        headerName: "Cantidad",
        width: 120,
    },{
        field: "unit",
        headerName: "Unidad",
        width: 120,
    },{
        field: "unitPrice",
        headerName: "Valor Unitario",
        width: 120,
        valueFormatter(params) {
            return formatter.format(params.value);
        },
    },{
        field: "totalPrice",
        headerName: "Valor total",
        width: 120,
        valueFormatter(params) {
            return formatter.format(params.value);
        },
    }
    
] 

export const cotizationReportColumns: GridColDef[] =[
    {
        field: "referenceNumber",
        headerName: "Referencia",
        width: 120,
    },{
        field: "comercialAgent",
        headerName: "Agente comercial",
        width: 220,
    },{
        field: "observations",
        headerName: "Observaciones",
        width: 220, 
    },{
        field: "creationDate",
        headerName: "Fecha de creacion",
        width: 120,
    },{
        field: "closedDate",
        headerName: "Fecha de cierre",
        width: 120,
    },{
        field: "companyName",
        headerName: "Cliente",
        width: 150,
    },{
        field: "contactName",
        headerName: "contacto",
        width: 220,
    },{
        field: "email",
        headerName: "Email",
        width: 220,
    },{
        field: "cellphone",
        headerName: "Teléfono",
        width: 100,
    },{
        field: "isClosed",
        headerName: "Estado",
        width: 120,
    }
    
] 