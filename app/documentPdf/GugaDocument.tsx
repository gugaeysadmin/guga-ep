"use client"
import React, {useState, useEffect} from "react";
import { Document, View, Page, Text, StyleSheet, Image, Svg, Font } from "@react-pdf/renderer";


import gugaLogoSvg from "../../public/gugaLogo.png";
import { footerImage } from "@/public/footerImage";
import { gugaLogoB64 } from "@/public/gugaLogoB64";
import { cotizationEquipment, cotizationGeneralData, cotizationsPrices } from "../entities/cotization";
import { newFooter } from "@/public/newFooter";
import { newHeader } from "@/public/newHeader";
import { gugaLogo } from "@/public/gugaLogo";
import { numberToWords } from "../services/spell";
import { newFooterNoBackground } from "@/public/newFooterNoBackground";
import { firma } from "@/public/firma";
import { newFooter2 } from "@/public/newFooter2";
import { newHeader2 } from "@/public/newHeader2";
import { commercialAgents } from "../entities/domains";
import { handleCommertialAgentFullName } from "../catalogos/components/TableRowConfiguration";
import { downloadSignature } from "../services/catalogServices";

Font.register({
    family: "OpenSans", fonts: [
        {src: "CustomFonts/OpenSans-VariableFont_wdth,wght.ttf"},
        {src: "CustomFonts/static/OpenSans/OpenSans-Bold.ttf", fontWeight: "bold"},
        {src: "CustomFonts/static/OpenSans/OpenSans-BoldItalic.ttf", fontWeight: "bold", fontStyle: "italic"},
        {src: "CustomFonts/static/OpenSans/OpenSans-ExtraBold.ttf", fontWeight: "ultrabold"},
        {src: "CustomFonts/static/OpenSans/OpenSans-ExtraBoldItalic.ttf", fontWeight: "ultrabold", fontStyle: "italic"},
        {src: "CustomFonts/static/OpenSans/OpenSans-Italic.ttf", fontStyle: "italic"},
        {src: "CustomFonts/static/OpenSans/OpenSans-Light.ttf", fontWeight: "light"},
        {src: "CustomFonts/static/OpenSans/OpenSans-LightItalic.ttf", fontWeight: "light", fontStyle: "italic"},
        {src: "CustomFonts/static/OpenSans/OpenSans-Medium.ttf", fontWeight: "medium"},
        {src: "CustomFonts/static/OpenSans/OpenSans-MediumItalic.ttf", fontWeight: "medium", fontStyle: "italic"},
        {src: "CustomFonts/static/OpenSans/OpenSans-Regular.ttf", fontWeight: "normal", fontStyle: "normal"},
        {src: "CustomFonts/static/OpenSans/OpenSans-SemiBold.ttf", fontWeight: "semibold"},
        {src: "CustomFonts/static/OpenSans/OpenSans-SemiBoldItalic.ttf", fontWeight: "semibold", fontStyle: "italic"},
    ]
});

Font.register({
    family: "OpenSans-Condensed", fonts: [
        {src: "CustomFonts/static/OpenSans/OpenSans_Condensed-Bold.ttf", fontWeight: "bold"},
        {src: "CustomFonts/static/OpenSans/OpenSans_Condensed-BoldItalic.ttf", fontWeight: "bold", fontStyle: "italic"},
        {src: "CustomFonts/static/OpenSans/OpenSans_Condensed-ExtraBold.ttf", fontWeight: "ultrabold"},
        {src: "CustomFonts/static/OpenSans/OpenSans_Condensed-ExtraBoldItalic.ttf", fontWeight: "ultrabold", fontStyle: "italic"},
        {src: "CustomFonts/static/OpenSans/OpenSans_Condensed-Italic.ttf", fontStyle: "italic"},
        {src: "CustomFonts/static/OpenSans/OpenSans_Condensed-Light.ttf", fontWeight: "light"},
        {src: "CustomFonts/static/OpenSans/OpenSans_Condensed-LightItalic.ttf", fontWeight: "light", fontStyle: "italic"},
        {src: "CustomFonts/static/OpenSans/OpenSans_Condensed-Medium.ttf", fontWeight: "medium"},
        {src: "CustomFonts/static/OpenSans/OpenSans_Condensed-MediumItalic.ttf", fontWeight: "medium", fontStyle: "italic"},
        {src: "CustomFonts/static/OpenSans/OpenSans_Condensed-Regular.ttf", fontWeight: "normal", fontStyle: "normal"},
        {src: "CustomFonts/static/OpenSans/OpenSans_Condensed-SemiBold.ttf", fontWeight: "semibold"},
        {src: "CustomFonts/static/OpenSans/OpenSans_Condensed-SemiBoldItalic.ttf", fontWeight: "semibold", fontStyle: "italic"},
    ]
});
Font.register({
    family: "OpenSans-SemiCondensed", fonts: [
        {src: "CustomFonts/static/OpenSans/OpenSans_SemiCondensed-Bold.ttf", fontWeight: "bold"},
        {src: "CustomFonts/static/OpenSans/OpenSans_SemiCondensed-BoldItalic.ttf", fontWeight: "bold", fontStyle: "italic"},
        {src: "CustomFonts/static/OpenSans/OpenSans_SemiCondensed-ExtraBold.ttf", fontWeight: "ultrabold"},
        {src: "CustomFonts/static/OpenSans/OpenSans_SemiCondensed-ExtraBoldItalic.ttf", fontWeight: "ultrabold", fontStyle: "italic"},
        {src: "CustomFonts/static/OpenSans/OpenSans_SemiCondensed-Italic.ttf", fontStyle: "italic"},
        {src: "CustomFonts/static/OpenSans/OpenSans_SemiCondensed-Light.ttf", fontWeight: "light"},
        {src: "CustomFonts/static/OpenSans/OpenSans_SemiCondensed-LightItalic.ttf", fontWeight: "light", fontStyle: "italic"},
        {src: "CustomFonts/static/OpenSans/OpenSans_SemiCondensed-Medium.ttf", fontWeight: "medium"},
        {src: "CustomFonts/static/OpenSans/OpenSans_SemiCondensed-MediumItalic.ttf", fontWeight: "medium", fontStyle: "italic"},
        {src: "CustomFonts/static/OpenSans/OpenSans_SemiCondensed-Regular.ttf", fontWeight: "normal", fontStyle: "normal"},
        {src: "CustomFonts/static/OpenSans/OpenSans_SemiCondensed-SemiBold.ttf", fontWeight: "semibold"},
        {src: "CustomFonts/static/OpenSans/OpenSans_SemiCondensed-SemiBoldItalic.ttf", fontWeight: "semibold", fontStyle: "italic"},
    ]
});

Font.register({
    family: "OpenSansFixed",
    src: "CustomFonts/OpenSans-VariableFont_wdth,wght.ttf",
})
    
const styles = StyleSheet.create({
    page: { 
        position: "relative",
        paddingBottom: 35,
        //paddingTop: 30,
    },
    content: {
        paddingTop: 30,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 80, 
        //marginTop: 30   
    },
    watermark: {
        position: "absolute",
        opacity: 0.2,
        width: "80%",
        top: 288,
        right: 188,
    },
    footer: {
        position: "absolute",
        width: "100%",
        top:685,
        borderColor: "#00B0F0",
        borderTopWidth: 3,
    },
    table: { 
        display: "flex", 
        width: "100%", 
        borderStyle: "solid", 
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 0,
        borderColor:"#AEAAAA",
    }, 
    tableRow: { 
        margin: "auto", 
        flexDirection: "row",
    }, 
    tableColHeader: { 
        borderStyle: "solid", 
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderColor:"#AEAAAA",
        borderTopWidth: 0, 
        backgroundColor: "#0067b5"
    }, 
    tableCol: { 
        display: "flex",
        flexDiretion:"row",
        flexWrap: "wrap",
        borderStyle: "solid", 
        borderWidth: 1, 
        borderColor:"#AEAAAA",
        borderLeftWidth: 0, 
        borderTopWidth: 0,
        textOverflow: "ellipsis",
    }, 
    tableColGeneralData: { 
        display: "flex",
        //flexWrap: "wrap",
        //flexDiretion:"row",
        borderStyle: "solid", 
        borderWidth: 1, 
        borderColor:"#AEAAAA",
        borderLeftWidth: 0, 
        borderTopWidth: 0,
        textOverflow: "ellipsis",
        textAlign:"center",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 20,
    }, 
    tableColEquipment: { 
        display: "flex",
        flexDiretion:"row",
        flexWrap: "wrap",
        borderStyle: "dotted", 
        borderWidth: .7, 
        borderColor:"#AEAAAA",
        borderLeftWidth: 0, 
        borderTopWidth: 0,
        textOverflow: "ellipsis",
        minHeight: 15,
        paddingLeft: 2,
        paddingRight: 2,
    },
    tableColPrices: { 
        display: "flex",
        flexDiretion:"row",
        flexWrap: "wrap",
        borderStyle: "dotted", 
        borderWidth: .7, 
        borderColor:"#AEAAAA",
        borderLeftWidth: 0, 
        borderTopWidth: 0,
        textOverflow: "ellipsis",
        paddingLeft: 2,
        paddingRight: 2,
    },
    tableColEquipmentFirst: { 
        display: "flex",
        flexDiretion:"row",
        flexWrap: "wrap",
        borderStyle: "dotted", 
        borderWidth: 0.7, 
        borderColor:"#AEAAAA",
        borderTopWidth: 0,
        textOverflow: "ellipsis",
        minHeight: 15,
        paddingLeft: 2,
        paddingRight: 2,

    }, 
    tableColPricesFirst: { 
        display: "flex",
        flexDiretion:"row",
        flexWrap: "wrap",
        borderStyle: "dotted", 
        borderWidth: 0.7, 
        borderColor:"#AEAAAA",
        borderTopWidth: 0,
        textOverflow: "ellipsis",
        paddingLeft: 2,
        paddingRight: 2,
    }, 
    tableHeaderCell: {
        margin: "auto", 
        marginTop: 1, 
        fontSize: 6, 
        //fontWeight: 900,
        color: "#FFFFFF",
        fontFamily: "OpenSans"
    },
    tableCell: { 
        margin: "auto", 
        fontSize: 5, 
        wordWrap: "brake-word",
        textOverflow: "ellipsis",
        fontFamily: "OpenSans"
    },
    tableCellGeneralData: { 
        //margin: "auto", 
        marginTop: 1, 
        marginLeft: 1,
        marginRight: 1,
        fontSize: 6, 
        //height: 20,
        fontWeight: "light",
        wordWrap: "brake-word",
        textOverflow: "ellipsis",
        fontFamily: "OpenSans"
    },
});

type GugaDocument = {
    generalData: cotizationGeneralData;
    equipments: cotizationEquipment[];
    prices: cotizationsPrices;
    commertialAgent: commercialAgents;
    signature: string;
}
    const GugaDocument: React.FC<GugaDocument> = ({generalData, equipments, prices, commertialAgent, signature})=> {
    var formatter = new Intl.NumberFormat(
        'es-MX', {
            style: 'currency',
            currency: 'MXN',
    });
    return (
        <Document >
            <Page size={"LETTER"}  style={styles.page}>

                <View fixed>
                    <Image src={gugaLogo} style={styles.watermark}/>
                    <Image src={newFooter2} style={styles.footer}/>
                </View> 
                <View style={{
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: 'center',
                    }}
                    fixed    
                >
                    <Image src={newHeader2} style={{height: 70}}/>

                </View> 
                <View style={styles.content}>
                    {/* <View style={{
                        display: "flex",
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 25,
                        marginBottom: 25,
                        color: "#0094cf",
                    }}>
                        <Text >
                            GUGA EQUIPOS Y SERVICIOS S.A. DE C.V.
                        </Text>
                    </View> */}

                    {/*Datos Generales*/}
                    <View style={styles.table}> 
                        <View style={styles.tableRow}> 
                            <View style={{...styles.tableColHeader, width: "25%"}}> 
                                <Text style={{...styles.tableHeaderCell}}>Cliente</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "13%"}}> 
                                <Text style={styles.tableHeaderCell}>Teléfono</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "25%"}}> 
                                <Text style={styles.tableHeaderCell}>Contacto</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "10%"}}> 
                                <Text style={styles.tableHeaderCell}>Fecha</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "17%"}}> 
                                <Text style={styles.tableHeaderCell}>Ciudad</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "10%", borderRight: 0}}> 
                                <Text style={styles.tableHeaderCell}>Cotización</Text> 
                            </View> 
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{...styles.tableColGeneralData, width: "25%", borderRightStyle: "dotted", borderRightWidth: 0.7}}> 
                                <Text style={{...styles.tableCellGeneralData, fontWeight: "normal"}}>{generalData?.companyName || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableColGeneralData, width: "13%", borderRightStyle: "dotted", borderRightWidth: 0.7}}> 
                                <Text style={styles.tableCellGeneralData}>{generalData?.cellphone || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableColGeneralData, width: "25%", borderRightStyle: "dotted", borderRightWidth: 0.7}}> 
                                <Text style={styles.tableCellGeneralData}>{generalData?.contactName || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableColGeneralData, width: "10%", borderRightStyle: "dotted", borderRightWidth: 0.7}}> 
                                <Text style={styles.tableCellGeneralData}>{generalData?.creationDate || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableColGeneralData, width: "17%", borderRightStyle: "dotted", borderRightWidth: 0.7}}> 
                                <Text style={styles.tableCellGeneralData}>{generalData?.city || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableColGeneralData, width: "10%" , borderRight: 0}}> 
                                <Text style={{...styles.tableCellGeneralData, fontWeight: "normal", color: "red"}}>
                                    {generalData?.referenceNumber || ""}
                                </Text> 
                            </View> 
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{...styles.tableColHeader, width: "35%"}}> 
                                <Text style={styles.tableHeaderCell}>Dirección</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "25%"}}> 
                                <Text style={styles.tableHeaderCell}>Email</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "10%"}}> 
                                <Text style={styles.tableHeaderCell}>Descuento (%)</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "10%"}}> 
                                <Text style={styles.tableHeaderCell}>Moneda</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "20%",  borderRight: 0}}> 
                                <Text style={styles.tableHeaderCell}>Agente Comercial</Text> 
                            </View>
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{...styles.tableColGeneralData, width: "35%", borderRightStyle: "dotted", borderRightWidth: 0.7}}> 
                                <Text style={styles.tableCellGeneralData}>{generalData?.address || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableColGeneralData, width: "25%", borderRightStyle: "dotted", borderRightWidth: 0.7}}> 
                                <Text style={styles.tableCellGeneralData}>{generalData?.email || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableColGeneralData, width: "10%", borderRightStyle: "dotted", borderRightWidth: 0.7}}> 
                                <Text style={styles.tableCellGeneralData}>{generalData?.discount == 0? " - " : generalData?.discount || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableColGeneralData, width: "10%", maxWidth: "10%", borderRightStyle: "dotted", borderRightWidth: 0.7}}> 
                                <Text style={styles.tableCellGeneralData}>{generalData?.currency || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableColGeneralData, width: "20%" , borderRight: 0}}> 
                                <Text style={styles.tableCellGeneralData}>{generalData?.comercialAgent || ""}</Text> 
                            </View>
                        </View>
                    </View >
                    {/*Equipos*/}
                    <View style={{...styles.table, marginTop: 15}}>
                        <View style={styles.tableRow}> 
                            <View style={{...styles.tableColHeader, width: "5%"}}> 
                                <Text style={styles.tableHeaderCell}>Item</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "20%"}}> 
                                <Text style={styles.tableHeaderCell}>Referencia</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "30%"}}> 
                                <Text style={styles.tableHeaderCell}>Descripción</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "10%"}}> 
                                <Text style={styles.tableHeaderCell}>Cantidad</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "10%"}}> 
                                <Text style={styles.tableHeaderCell}>Unidad</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "12.5%"}}> 
                                <Text style={styles.tableHeaderCell}>Valor Unitario</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "12.5%"}}> 
                                <Text style={styles.tableHeaderCell}>Valor total</Text> 
                            </View> 
                        </View>
                        {!!equipments?(<>
                            {equipments.map((element, index)=>(
                                <View key={index} style={styles.tableRow}> 
                                    <View style={{...styles.tableColEquipment, width: "5%", backgroundColor: "#DDEBF7", textAlign: "center"}}> 
                                        <Text style={{...styles.tableCell}}>{index + 1 || "  "}</Text> 
                                    </View> 
                                    <View style={{...styles.tableColEquipment, width: "20%"}}> 
                                        <Text style={styles.tableCell}>{element?.reference || "  "}</Text> 
                                    </View> 
                                    <View style={{...styles.tableColEquipment, width: "30%"}}> 
                                        <Text style={styles.tableCell}>{element?.description || "  "}</Text> 
                                    </View> 
                                    <View style={{...styles.tableColEquipment, width: "10%", textAlign: "center"}}> 
                                        <Text style={styles.tableCell}>{element?.amount || "  "}</Text> 
                                    </View> 
                                    <View style={{...styles.tableColEquipment, width: "10%", textAlign: "center"}}> 
                                        <Text style={styles.tableCell}>{element?.unit || "  "}</Text> 
                                    </View> 
                                    <View style={{...styles.tableColEquipment, width: "2.5%", borderRightWidth: 0,}}> 
                                        <Text style={styles.tableCell}>$</Text> 
                                    </View> 
                                    <View style={{...styles.tableColEquipment, width: "10%", borderLeftWidth: 0, textAlign: "right",}}> 
                                        <Text style={styles.tableCell}>{formatter.format(element?.unitPrice).replace("$","") || "  "}</Text> 
                                    </View> 
                                    <View style={{...styles.tableColEquipment, width: "2.5%",borderRightWidth: 0,}}> 
                                        <Text style={{...styles.tableCell, color: "red"}}>$</Text> 
                                    </View> 
                                    <View style={{...styles.tableColEquipment, width: "10%", borderLeftWidth: 0,borderRightWidth: 0,textAlign: "right",}}> 
                                        <Text style={{...styles.tableCell, color: "red"}}>{formatter.format(element?.unitPrice).replace("$","")  || "  "}</Text> 
                                    </View> 
                                </View>
                            ))}
                        </>):(<>
                            <View  style={styles.tableRow}> 
                                <View style={{...styles.tableColEquipment, width: "5%"}}> 
                                    <Text style={styles.tableCell}>{"  "}</Text> 
                                </View> 
                                <View style={{...styles.tableColEquipment, width: "20%"}}> 
                                    <Text style={styles.tableCell}>{"  "}</Text> 
                                </View> 
                                <View style={{...styles.tableColEquipment, width: "30%"}}> 
                                    <Text style={styles.tableCell}>{"  "}</Text> 
                                </View> 
                                <View style={{...styles.tableColEquipment, width: "10%"}}> 
                                    <Text style={styles.tableCell}>{"  "}</Text> 
                                </View> 
                                <View style={{...styles.tableColEquipment, width: "10%"}}> 
                                    <Text style={styles.tableCell}>{"  "}</Text> 
                                </View> 
                                <View style={{...styles.tableColEquipment, width: "2.5%", borderRightWidth: 0,}}> 
                                    <Text style={styles.tableCell}>$</Text> 
                                </View> 
                                <View style={{...styles.tableColEquipment, width: "10%", borderLeftWidth: 0, textAlign: "right",}}> 
                                    <Text style={styles.tableCell}>{"  "}</Text> 
                                </View> 
                                <View style={{...styles.tableColEquipment, width: "2.5%",borderRightWidth: 0,}}> 
                                    <Text style={styles.tableCell}>$</Text> 
                                </View> 
                                <View style={{...styles.tableColEquipment, width: "10%", borderLeftWidth: 0,textAlign: "right",}}> 
                                    <Text style={styles.tableCell}>{"  "}</Text> 
                                </View> 
                            </View>
                        </>)}
                    </View>
                    <View style={{display: "flex", justifyContent: "flex-end"}}>
                        <View style={styles.tableRow}>
                            <View style={{ width: "74.9%"}}> 
                            </View>  
                            <View style={{...styles.tableColPricesFirst, width: "12.5%"}}> 
                                <Text style={styles.tableCell}>Importe</Text> 
                            </View> 
                            <View style={{...styles.tableColPrices, width: "2.5%",borderRightWidth: 0,}}> 
                                <Text style={styles.tableCell}>$</Text> 
                            </View> 
                            <View style={{...styles.tableColPrices, width: "10%", borderLeftWidth: 0,textAlign: "right",}}> 
                                <Text style={styles.tableCell}>{formatter.format(prices?.amount).replace("$","")  || ""}</Text> 
                            </View> 
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{ width: "74.9%"}}> 
                            </View> 
                            <View style={{...styles.tableColPricesFirst, width: "12.5%"}}> 
                                <Text style={{...styles.tableCell, color: "red"}}>Descuento</Text> 
                            </View> 
                            <View style={{...styles.tableColPrices, width: "2.5%",borderRightWidth: 0,}}> 
                                <Text style={{...styles.tableCell, color: "red"}}>$</Text> 
                            </View> 
                            <View style={{...styles.tableColPrices, width: "10%", borderLeftWidth: 0,textAlign: "right",}}> 
                                <Text style={{...styles.tableCell, color: "red"}}>{formatter.format(prices?.discount).replace("$","") || ""}</Text> 
                            </View> 
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{ width: "74.9%"}}> 
                            </View> 
                            <View style={{...styles.tableColPricesFirst, width: "12.5%"}}> 
                                <Text style={styles.tableCell}>Subtotal</Text> 
                            </View> 
                            <View style={{...styles.tableColPrices, width: "2.5%",borderRightWidth: 0,}}> 
                                <Text style={styles.tableCell}>$</Text> 
                            </View> 
                            <View style={{...styles.tableColPrices, width: "10%", borderLeftWidth: 0,textAlign: "right",}}> 
                                <Text style={styles.tableCell}>{formatter.format(prices?.subtotal).replace("$","") || ""}</Text> 
                            </View> 
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{ width: "74.9%"}}> 
                            </View> 
                            <View style={{...styles.tableColPricesFirst, width: "12.5%"}}> 
                                <Text style={styles.tableCell}>Iva (16%)</Text> 
                            </View> 
                            <View style={{...styles.tableColPrices, width: "2.5%",borderRightWidth: 0,}}> 
                                <Text style={styles.tableCell}>$</Text> 
                            </View> 
                            <View style={{...styles.tableColPrices, width: "10%", borderLeftWidth: 0, textAlign: "right",}}> 
                                <Text style={styles.tableCell}>{ formatter.format(prices?.iva).replace("$","") || ""}</Text> 
                            </View> 
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{ width: "74.9%"}}> 
                            </View> 
                            <View style={{...styles.tableColPricesFirst, width: "12.5%"}}> 
                                <Text style={styles.tableCell}>TOTAL</Text> 
                            </View> 
                            <View style={{...styles.tableColPrices, width: "2.5%",borderRightWidth: 0,}}> 
                                <Text style={styles.tableCell}>$</Text> 
                            </View> 
                            <View style={{...styles.tableColPrices, width: "10%", borderLeftWidth: 0, textAlign: "right",}}> 
                                <Text style={styles.tableCell}>{formatter.format(prices?.total).replace("$","") || ""}</Text> 
                            </View> 
                        </View>
                    </View>
                    {/*Monto*/}
                    <View style={{...styles.table, marginTop: 15}}>
                        <View style={styles.tableRow}> 
                            <View style={{...styles.tableColHeader, width: "100%", borderBottomColor: "#0067b5", borderRightWidth: 0}}> 
                                <Text style={{...styles.tableHeaderCell, fontStyle: "italic"}}>MONTO EN LETRA:</Text> 
                            </View> 
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{...styles.tableColHeader, width: "100%", borderTopColor: "#0067b5", borderRightWidth: 0}}> 
                                <Text style={{...styles.tableHeaderCell, fontStyle: "italic"}}>{numberToWords(prices?.total || 0, generalData?.currency || "N/A")}</Text> 
                            </View> 
                        </View>
                    </View>
                    {/*Condiciones comerciales*/}
                    <View style={{...styles.table, marginTop: 15}}>
                        <View style={styles.tableRow}> 
                            <View style={{...styles.tableColHeader, width: "100%", borderRightWidth: 0}}> 
                                <Text style={styles.tableHeaderCell}>Condiciones comerciales:</Text> 
                            </View> 
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{...styles.tableCol, width: "100%", borderRightWidth: 0}}> 
                                <Text style={{...styles.tableCell, fontFamily: "OpenSans", fontStyle: "italic", fontWeight: "bold"}}>
                                    {generalData?.comercialConditions || ""}
                                </Text> 
                            </View> 
                        </View>
                    </View>
                    <View break={true}>
                        <View>
                            <Text style={{ width: "100%",  fontSize: 11, marginTop: 4, fontFamily: "OpenSans" }}>
                                {generalData?.finalStatment || ""}
                            </Text> 
                        </View>
                        <View style={{marginTop: 8}}>
                            <View style={{width:"100%", textAlign: "center"}}>
                                <Text style={{ fontSize: 11, fontFamily: "OpenSans"}}>
                                    Atentamente
                                </Text>
                                <Text style={{ fontSize: 12, fontFamily: "OpenSans"}}>
                                    GUGA EQUIPOS Y SERVICIOS
                                </Text>
                            </View>
                            <View style={{display: "flex", width:"100%", textAlign: "center", justifyContent: "center", alignItems: "center"}}>
                                { !!signature?(
                                    <Image src={signature} style={{height: 40}}/>
                                ):(<>
                                    <View style={{height: 15}}></View>
                                </>)}
                                <Text style={{ fontSize: 12, fontFamily: "OpenSans"}}>
                                    {handleCommertialAgentFullName(commertialAgent?.names || "n/a", commertialAgent?.firstLastName|| "n/a", commertialAgent?.secondLastName || "")}    
                                </Text>
                                <Text style={{ fontSize: 11, fontFamily: "OpenSans"}}>
                                    {commertialAgent?.role || "n/a"}
                                </Text>
                            </View>
                        </View>
                        
                    </View>

                </View>

            </Page>
        </Document>
    )
}

export default GugaDocument;
