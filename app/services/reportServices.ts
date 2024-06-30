import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getReports = async () => {
    let response: any[] = [];
    const snapshot = await getDocs(collection(db,"reports"));

    snapshot.forEach((doc)=>{
        response.push(doc.data());
    })
    return response;

}

