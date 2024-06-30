import React, {useState, useEffect} from "react";
import { cotizationEquipment, cotizationGeneralData, cotizationsPrices } from "../entities/cotization";
import { commercialAgents } from "../entities/domains";
import { getCommercialAgent, getCommercialAgents } from "../services/catalogServices";

export const useCotization = () => {
    const [discount, setDiscount] = useState(0);
    const [equipments, setEquipments] = useState<cotizationEquipment[]>([])
    const [generalData, setGeneralData] = useState<cotizationGeneralData>(null);
    const [commertialAgent,setCommertialAgent] = useState<commercialAgents>(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [prices, setPrices] = useState<cotizationsPrices>({
        amount: 0,
        discount: 0,
        subtotal: 0,
        iva: 0,
        total: 0,
    })

    useEffect(()=>{
        if(!!generalData){
            setDiscount(generalData.discount);
            setEquipments(generalData.equipmentAsociated);
            // if(!!generalData.comercialAgentId){
            //     try {
            //         getCommercialAgent(generalData.comercialAgentId).then((data) => {
            //             setCommertialAgent(data);
            //         });
            //     } catch (error) {
            //         console.log(error);
            //     }
            // }
        }
    },[generalData])

    useEffect(()=>{
        let total = 0
        if(!!equipments && equipments.length != 0 ){
            equipments.map((element, index) => {
                total = total + parseFloat( element.totalPrice.toString() )
            });
        }

        setTotalPrice(total);
        
    },[equipments])

    useEffect(()=>{
        if(!!totalPrice && totalPrice != 0)
            handlePrices()
    },[totalPrice, discount])

    const handlePrices = () => {
        console.log("manejando precios")
        let amount = totalPrice;
        let withdiscount =  totalPrice * (discount / 100);
        let subtotal = totalPrice - withdiscount;
        let iva = subtotal * 0.16;
        let total = subtotal + iva;
        setPrices({
            amount: amount,
            discount: withdiscount,
            subtotal: subtotal,
            iva: iva,
            total: total,
        })
        return {
            amount: amount,
            discount: withdiscount,
            subtotal: subtotal,
            iva: iva,
            total: total,
        }
    }


        return {
            setDiscount,
            generalData,
            setGeneralData, 
            equipments,
            setEquipments,
            prices,
            setPrices,
            totalPrice,
            setTotalPrice,
        }
} 


