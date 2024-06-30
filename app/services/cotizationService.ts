import { collection, getDocs, doc, getDoc, DocumentData, Timestamp, addDoc, query, where, deleteDoc, updateDoc, orderBy, limit } from "firebase/firestore";
import { db } from "./firebase";
import { v4 as uuidV4} from "uuid";

import { cotizationGeneralData, cotizationOverview } from "../entities/cotization";
import { commercialAgents, reports } from "../entities/domains";
import { report } from "process";

const isOlderThanTwoMonths = (dateString: string): boolean => {
    const cotizationDate = new Date(dateString);
    const currentDate = new Date();
  
    // Restar dos meses a la fecha actual
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(currentDate.getMonth() - 2);
  
    return cotizationDate < twoMonthsAgo;
};
export const getCotizationsOverview = async ( userName: string, userId: string) => {
    const snapshot = await getDocs(collection(db,"cotizations"))
        .catch((error)=>{throw error});
    let response :any[] = [];
    
    snapshot.forEach((doc) => {
        if(isOlderThanTwoMonths(doc.data().creationDate))
            response.unshift(doc.data()) //removeCotization(doc.data().cotizationId)
        else
            response.unshift(doc.data())
            
    });
    return response.filter((doc) => doc.comercialAgentId === userId).sort((a, b) => b.referenceNumberId - a.referenceNumberId);
    //return response.filter((doc) => doc.comercialAgent === userName).sort((a, b) => b.referenceNumberId - a.referenceNumberId);
}
export const getAllCotization = async () => {
    const snapshot = await getDocs(collection(db,"cotizations"))
        .catch((error)=>{throw error});
    let response :any[] = [];
    
    snapshot.forEach((doc) => {
        response.unshift(doc.data())
    });

    return response.sort((a, b) => b.referenceNumberId - a.referenceNumberId);
}


export const getClosedCotization = async () => {
    const snapshot = await getDocs(collection(db,"cotizations"))
        .catch((error)=>{throw error});
    let response :any[] = [];
    
    snapshot.forEach((doc) => {
        response.unshift(doc.data())
    });

    return response.filter((doc) => doc.isClosed).sort((a, b) => b.referenceNumberId - a.referenceNumberId);
}

export const getCotizationsPerAgent = async (id: string) => {
    const snapshot = await getDocs(collection(db,"cotizations"))
        .catch((error)=>{throw error});
    let response :any[] = [];
    
    snapshot.forEach((doc) => {
        response.unshift(doc.data())
    });

    return response.filter((doc) => doc.comercialAgentId === id).sort((a, b) => b.referenceNumberId - a.referenceNumberId);
}

export const getOpenCotization = async () => {
    const snapshot = await getDocs(collection(db,"cotizations"))
        .catch((error)=>{throw error});
    let response :any[] = [];
    
    snapshot.forEach((doc) => {
        response.unshift(doc.data())
    });

    return response.filter((doc) => !doc.isClosed).sort((a, b) => b.referenceNumberId - a.referenceNumberId);
}

export const removeCotization = async (identifier: string) => {
    var id;
    
    const q =  query(collection(db,"cotizations"), where("cotizationId", "==",identifier));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        id = doc.id;
    });

    await deleteDoc(doc(db, "cotizations", id))
        .catch((err)=>{throw err});
}

export const saveCotization = async ( data : cotizationGeneralData) => {
    data.cotizationId = uuidV4();
    const docRef = await addDoc(collection(db,"cotizations"), data).catch((err) => {
        console.log(err);
        throw err
    })
    
    await addCotizationToAgent(data.comercialAgentId);
    await actualizeCotizationNumber();
    return data;
}

export const updateCotization = async ( newData : cotizationGeneralData) => {
    var id;
    
    const q =  query(collection(db,"cotizations"), where("cotizationId", "==",newData.cotizationId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        id = doc.id;
    });

    console.log(id);
    await updateDoc(doc(db,"cotizations",id), newData)
        .catch((err)=>{throw err});
}

export type closeCotizationData = {
    newData : cotizationGeneralData;
    totalPrice: number;
    isNew: boolean;
}

export const closeCotization = async ( closeData: closeCotizationData) => {
    var id;
    let report: reports  = {
        reportId: uuidV4().toString(),
        client: "",
        contact: "",
        creationDate: "",
        closeDate: "",
        email: "",
        numCotization: "",
        observations: "",
        phone: "",
        totalPrice: 0,
        whoMadeIt: "",
        commertialAgentId: ""
    };

    var closeDate = new Date().toISOString().split("T")[0]; 
    report.reportId  = uuidV4();
    closeData.newData.isClosed = true;
    closeData.newData.closeDate = closeDate;
        
    try{
        report.reportId = uuidV4();
        report.client = closeData.newData.companyName;
        report.contact = closeData.newData.contactName;
        report.creationDate = closeData.newData.creationDate;
        report.closeDate = closeDate;
        report.email = closeData.newData.email;
        report.numCotization = closeData.newData.referenceNumber;
        report.observations = closeData.newData.observations;
        report.phone = closeData.newData.cellphone;
        report.totalPrice = closeData.totalPrice;
        report.whoMadeIt = closeData.newData.comercialAgent;
        report.commertialAgentId = closeData.newData.comercialAgentId;

        const docRef = await addDoc(collection(db,"reports"), report).catch((err) => { throw err})

        if(closeData.isNew){
            await saveCotization(closeData.newData);
        }else {
            const q =  query(collection(db,"cotizations"), where("cotizationId", "==",closeData.newData.cotizationId));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                id = doc.id;
            });
            await updateDoc(doc(db,"cotizations",id), closeData.newData)
            //return docRef;
        }

    }catch(err){
        console.log(err);    
        throw err
    };
}

export const addCotizationToAgent = async (agentId: string) => {
    const q =  query(collection(db,"commercialAgents"), where("agentId", "==",agentId));
    const querySnapshot = await getDocs(q);

    let commertialAgent;
    let id;
    
    querySnapshot.forEach((doc) => {
        commertialAgent = doc.data();
        id = doc.id;
    });

    commertialAgent.numCotizations = Number(commertialAgent.numCotizations) + 1;

    await updateDoc(doc(db,"commercialAgents",id), commertialAgent)
        .catch((err)=>{throw err});
}

export const actualizeCotizationNumber = async () => {
    let cotizationNumber = 0;
    const snapshot = await getDocs(collection(db,"configuration"))
        .catch((error)=>{throw error});
    
    snapshot.forEach((doc) => {
        cotizationNumber = doc.data().current           
    });
    await updateDoc(doc(db,"configuration","currentid"), {current: cotizationNumber + 1})
        .catch((err)=>{throw err});
}
export const getCotizationNumber = async () => {
    let cotizationNumber = 0;
    // const q =  query(collection(db,"cotizations"), orderBy("referenceNumberId", "desc"), limit(1));
    // const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //     cotizationNumber = doc.data().referenceNumberId;
    //     console.log(doc.data());
    // });

    
    const snapshot = await getDocs(collection(db,"configuration"))
        .catch((error)=>{throw error});
    
    snapshot.forEach((doc) => {
        cotizationNumber = doc.data().current           
    });

    console.log(`cotization ${cotizationNumber}`);
    // const snapshot = await getDocs(collection(db,"reports"))
    //     .catch((error)=>{throw error});
    // let response :any[] = [];
    
    // snapshot.forEach((doc) => {
    //     cotizationNumber = cotizationNumber + 1
    // });


    return cotizationNumber + 1; 
}

export const generateReferenceNumber = (cotizationNumberId: number) => {
    return `EyS${cotizationNumberId}`
    //return `EyS`
}