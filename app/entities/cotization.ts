import { Timestamp } from "firebase/firestore";

export type cotizationOverview = {
    agentInitials: string;
    client: string;
    commercialAgent: string;
    contact: string;
    numCotization: string;
    creationDate: Timestamp;
}

export type cotizationGeneralData = {
    cotizationId: string;
    isClosed: boolean;
    companyName: string;
    contactName: string;
    cellphone: string;
    creationDate: string;
    closeDate: string;
    city: string;
    address: string;
    email: string;
    discount: number;
    currency: string;
    referenceNumber: string;
    referenceNumberId: number;
    comercialConditions: string;
    finalStatment: string;
    comercialAgent: string;
    comercialAgentId: string;
    equipmentAsociated: cotizationEquipment[];
    observations: string;
}

export type cotizationsPrices = {
    amount: number;
    discount: number;
    subtotal: number;
    iva: number;
    total: number;
}

export type cotizationEquipment = {
    id: number;
    item: string;
    reference: string;
    description: string;
    amount: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
    code?: string;
}

export const comertialConditions = `a) Precios expresados en dólares americanos pagaderos al tipo de cambio de BBVA Bancomer. 
b) Forma de pago: 50% contra presentación de O.C., 25% con el aviso del embarque y 25% con la instalación y puesta en marcha
c) Tiempo de entrega: 90 días.
d) Instalación, capacitación y puesta en marcha incluida.
e) Vigencia de esta cotización: 15 días.
f) Envió incluido.
g) La cancelación de una O.C. causara un cargo del 10% sobre el monto de la O.C. antes de IVA.
h) No aplica cambios ni devoluciones una vez entregado el producto.

`

export const finalStatement = `Sin otro particular de momento, quedo a sus órdenes para cualquier aclaración al respecto.`;