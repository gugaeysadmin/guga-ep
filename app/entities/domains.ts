import { Timestamp } from "firebase/firestore"
export type clients = {
    clientId: string,
    companyDirection: string,
    companyName: string,
    contactEmail: string,
    contactName: string,
    contactPhone: string,
    contactSecondPhone: string,
}

export type commercialAgents = {
    agentId: string,
    email: string,
    names: string,
    firstLastName: string,
    secondLastName: string,
    phone: string,
    secondPhone: string,
    numCotizations: number,
    isAdmin: boolean,
    password?: string,
    signature?: string,
    role?: string
}

export type commercialAgentsForm = {
    agentId: string,
    email: string,
    names: string,
    firstLastName: string,
    secondLastName: string,
    phone: string,
    secondPhone: string,
    numCotizations: number,
    isAdmin: boolean,
    password?: string,
    repeatPassword?: string,
    signature?: string,
    role?: string
}

export type cotizations = {
    cotizationId: string,
    agentInitials: string,
    client: string,
    commercialAgentId: string,
    contact: string,
    creationDate: Timestamp,
    numCotization: string,
}

export type referenceEquipment = {
    referenceId: string,
    name: string,
    description: string,
    brand: string, 
    price: number,
    codeNumber: string,
}

export type reports = {
    reportId: string, 
    client: string,
    contact: string,
    creationDate: string,
    closeDate: string,
    email: string,
    numCotization: string,
    observations: string,
    phone: string,
    totalPrice: number,
    whoMadeIt: string
    commertialAgentId: string
}

export type LogInInfo = {
    logIn: {
        logged: boolean,
        name: string,
        lastName: string,
        secondLastName: string,
        userId: string,
        isAdmin: boolean,
    }
}