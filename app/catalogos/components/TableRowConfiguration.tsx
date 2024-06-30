import { cotizationEquipment, cotizationGeneralData } from "@/app/entities/cotization";
import { clients, commercialAgents, referenceEquipment } from "@/app/entities/domains";


export const getClientRows = (clientList: clients[]) => {
    const rows = clientList.map((element)=>{
        return {
            id: element.clientId,
            companyDirection: element.companyDirection,
            companyName: element.companyName,
            contactEmail: element.contactEmail,
            contactName: element.contactName,
            contactPhone: element.contactPhone,
            contactSecondPhone: element.contactSecondPhone,
        }
     })

     return rows;
}

export const getCommercialAgentsRows = (agentList: commercialAgents[]) => {
    const rows = agentList.map((element)=>{
        return {
            id: element.agentId,
            fullName: handleCommertialAgentFullName(element.names, element.firstLastName, element.secondLastName),
            role: element.role,
            numCotizations: element.numCotizations,
            email: element.email,
            phone: element.phone,
            secondPhone: element.secondPhone,
        }
     })

     return rows;
}

export const getCotizationsPerAgens = (agentList: commercialAgents[]) => {
    const rows = agentList.map((element)=>{
        return {
            id: element.agentId,
            fullName: handleCommertialAgentFullName(element.names, element.firstLastName, element.secondLastName),
            email: element.email,
            numCotizations: element.numCotizations,
        }
     })

     return rows;
}

export const getEquipmentRows = (equipment: referenceEquipment[]) => {
    const rows = equipment.map((element)=>{
        return {
            id: element.referenceId,
            codeNumber: element.codeNumber,
            name: element.name,
            brand: element.brand,
            description: element.description,
            price: element.price,
        }
     })
     return rows;
}

export const getCotizationRows = (cotization: cotizationGeneralData[]) => {
    const rows = cotization.map((element)=>{
        return {
            id: element.cotizationId,
            referenceNumber: element.referenceNumber,
            creationDate: element.creationDate,
            closedDate: element.closeDate,
            observations: element.observations,
            companyName: element.companyName,
            contactName: element.contactName,
            email: element.email,
            cellphone: element.cellphone,
            comercialAgent: element.comercialAgent,
            isClosed: element.isClosed ? "Cerrado" : "Abierto",
        }
     })
     return rows;
}

export const handleCommertialAgentFullName = (name: string, firstLastName: string, secondLastName?: string) => {
    if(!!secondLastName)
        return `${name} ${firstLastName} ${secondLastName}`;
    return `${name} ${firstLastName}`;
}