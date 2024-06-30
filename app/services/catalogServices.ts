import { collection, getDocs ,deleteDoc,addDoc, updateDoc, where, doc,query } from "firebase/firestore";
import { deleteObject, getBlob, getDownloadURL, getStorage, getStream, ref, uploadBytes } from "firebase/storage";

import { db } from "./firebase";
import { clients, referenceEquipment, commercialAgents, reports } from "../entities/domains";
import { v4 as uuidV4} from "uuid";
import { securePassword } from "./security";

export const getClients = async () => {
    const snapshot = await getDocs(collection(db,"clients"));
    let response: any[] = [];

    snapshot.forEach((doc) => {
        response.push(doc.data());
    });

    return response.reverse();
}   

export const saveClients = async (data: clients) => {
    data.clientId = uuidV4();
    let client = data.companyName.trimEnd().trimStart();
    let contact = !!data?.contactName? data.contactName.trimEnd().trimStart(): "";
    
    data.companyName = client;
    data.contactName = contact; 
    const docRef = await addDoc(collection(db,"clients"), data).catch((err) => { throw err})
    return docRef;
}

export const updateClients = async (newData: clients) => {

    var id;
    
    const q =  query(collection(db,"clients"), where("clientId", "==",newData.clientId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        id = doc.id;
    });

    let client = newData.companyName.trimEnd().trimStart();
    let contact = newData.contactName.trimEnd().trimStart();
    
    newData.companyName = client;
    newData.contactName = contact; 

    await updateDoc(doc(db,"clients",id), newData)
        .catch((err)=>{throw err});
}

export const removeClients = async (clientId: string) => {
    var id;
    
    const q =  query(collection(db,"clients"), where("clientId", "==",clientId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        id = doc.id;
    });

    await deleteDoc(doc(db, "clients", id))
        .catch((err)=>{throw err});
}

export const getEquipments = async () => {
    const snapshot = await getDocs(collection(db,"referenceEquipment"));
    let response: any[] = [];

    snapshot.forEach((doc) => {
        response.push(doc.data());
    });

    return response.reverse();
}

export const saveEquipments = async (data: referenceEquipment) => {
    data.referenceId = uuidV4();
    const reference = data.name.trimEnd().trimStart();  
    data.name = reference;

    const docRef = await addDoc(collection(db,"referenceEquipment"), data).catch((err) => { throw err})
    return docRef;
}

export const updateEquipments = async (newData: referenceEquipment) => {
    var id ;
    const q =  query(collection(db,"referenceEquipment"), where("referenceId", "==", newData.referenceId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        id = doc.id;
    });

    const reference = newData.name.trimEnd().trimStart();  
    newData.name = reference;

    await updateDoc(doc(db,"referenceEquipment",id), newData)
        .catch((err)=>{throw err});
}

export const removeEquipment = async (referenceId: string) => {
    var id;
    
    const q =  query(collection(db,"referenceEquipment"), where("referenceId", "==",referenceId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        id = doc.id;
    });

    await deleteDoc(doc(db, "referenceEquipment", id))
        .catch((err)=>{throw err});
}

export const getCommercialAgents = async () => {
    const snapshot = await getDocs(collection(db,"commercialAgents"));
    let response: any[] = [];

    snapshot.forEach((doc) => {
        response.push(doc.data());
    });


    console.log(response);

    return response.reverse();
}

export const getCommercialAgent = async ( agentId: string) => {
    const snapshot = query(collection(db,"commercialAgents"), where("agentId", "==", agentId));
    const querySnapshot = await getDocs(snapshot);
    let response: any[] = [];
    querySnapshot.forEach((doc) => {
        response.push(doc.data());
    });
    return response[0];
}

export const saveCommercialAgents = async (data: commercialAgents, signature: File) => {

    data.agentId = uuidV4();
    data.numCotizations = 0;
    data.signature = await saveSignature(signature);
    let hashPassword;
    if (data.isAdmin){
        hashPassword = await securePassword(data.password);
        data.password = hashPassword;
    } else{
        data.password = "";
    }
    const docRef = await addDoc(collection(db,"commercialAgents"), data).catch((err) => { throw err})
    return docRef;
}

export const updateCommercialAgent = async (newData: commercialAgents, signature?: File ) => {
    var id;
    const q =  query(collection(db,"commercialAgents"), where("agentId", "==",newData.agentId));
    const querySnapshot = await getDocs(q);
    let hashPassword;

    querySnapshot.forEach((doc) => {
        id = doc.id;
        hashPassword = doc.data().password;
    });

    let newFixedData: commercialAgents = {
        agentId: newData.agentId,
        email: newData.email,
        names: newData.names,
        firstLastName: newData.firstLastName,
        secondLastName: newData.secondLastName,
        phone: newData.phone,
        secondPhone: newData.secondPhone,
        numCotizations: newData.numCotizations,
        isAdmin: newData.isAdmin,
        role: newData.role
    }

    if (newData.isAdmin && !!newData.password){
        hashPassword = await securePassword(newData.password);
        newFixedData = {
            ...newFixedData,
            password: hashPassword
        }
    } else{
        newFixedData = {
           ...newFixedData,
            password: hashPassword
        }
    }
    if(!!signature){
        newFixedData.signature = await updateSignature(signature, newData.signature);
    }



    await updateDoc(doc(db,"commercialAgents",id), newFixedData)
        .catch((err)=>{throw err});
}

export const removeCommercialAgent = async (agentId: string) => {

    var id;
    var signatureId
    const q =  query(collection(db,"commercialAgents"), where("agentId", "==",agentId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        id = doc.id;
        signatureId = doc.data().signature;
    });

    await deleteDoc(doc(db, "commercialAgents", id))
        .catch((err)=>{throw err});

    await removeSignature(signatureId)
        .catch((err)=>{throw err});
}


export const saveSignature = async (signature: File, signatureId?: string) =>{
    const id = !!signatureId ? signatureId : uuidV4();
    const storage = getStorage();
    const storageRef = ref(storage, `signatures/${id}.png`);
    try{
        await uploadBytes(storageRef, signature)
    } catch (err){
        throw err;
    }
    return id
}

export const updateSignature = async (signature: File, actualSignature: string) =>{
    try{
        if(!!actualSignature){
            await removeSignature(actualSignature);
            let signatureId = uuidV4();
            return await saveSignature(signature, signatureId);
        } else{
            return await saveSignature(signature);
        }
    } catch (err){
        throw err;
    }
}

export const removeSignature = async (signatureId: string) =>{
    const storage = getStorage();

    const desertRef = ref(storage, `signatures/${signatureId}.png`);

    try{
        deleteObject(desertRef)
    } catch (err){
        throw err;
    }
}

export const downloadSignature = async (signatureId: string) =>{
    const storage = getStorage();
    const desertRef = ref(storage, `signatures/${signatureId}.png`);
    try{

        let url = await  getDownloadURL(desertRef)
        return url
    }catch (err){
        throw err
    }
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            if (reader.result) {
                resolve(reader.result as string);
            } else {
                reject("Error converting blob to base64");
            }
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
};