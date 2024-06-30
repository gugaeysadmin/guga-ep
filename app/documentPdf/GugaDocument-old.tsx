"use client"
import React, {useState, useEffect} from "react";
import { Document, View, Page, Text, StyleSheet, Image, Svg } from "@react-pdf/renderer";

import gugaLogoSvg from "../../public/gugaLogo.png";
import { footerImage } from "@/public/footerImage";
import { gugaLogoB64 } from "@/public/gugaLogo";
import { cotizationEquipment, cotizationGeneralData, cotizationsPrices } from "../entities/cotization";

const styles = StyleSheet.create({
    page: { 
        position: "relative",
    },
    content: {
        paddingTop: 30,
        paddingLeft: 55,
        paddingRight: 30,
        paddingBottom: 80,    
    },
    watermark: {
        position: "absolute",
        opacity: 0.5,
        width: "65%",
        top: 300,
        left: 100,
    },
    footer: {
        position: "absolute",
        width: "70%",
        top: 685,
        left: 80,
    },
    table: { 
        display: "flex", 
        width: "100%", 
        borderStyle: "solid", 
        borderWidth: 1,
        borderBottomWidth: 0,
        borderRight: 0,
        borderColor:"#7f7f7f",
    }, 
    tableRow: { 
        margin: "auto", 
        flexDirection: "row",
    }, 
    tableColHeader: { 
        borderStyle: "solid", 
        borderWidth: 1, 
        borderLeftWidth: 0, 
        borderColor:"#7f7f7f",
        borderTopWidth: 0, 
        backgroundColor: "#0067b5"
    }, 
    tableCol: { 
        display: "flex",
        flexDiretion:"row",
        flexWrap: "wrap",
        borderStyle: "solid", 
        borderWidth: 1, 
        borderColor:"#7f7f7f",
        borderLeftWidth: 0, 
        borderTopWidth: 0,
        textOverflow: "ellipsis",
    }, 
    tableColEquipment: { 
        display: "flex",
        flexDiretion:"row",
        flexWrap: "wrap",
        borderStyle: "dashed", 
        borderWidth: .5, 
        borderColor:"#7f7f7f",
        borderLeftWidth: 0, 
        borderTopWidth: 0,
        textOverflow: "ellipsis",
    }, 
    tableHeaderCell: {
        margin: "auto", 
        marginTop: 1, 
        fontSize: 6, 
        fontWeight: 900,
        color: "#FFFFFF",
    },
    tableCell: { 
        margin: "auto", 
        marginTop: 1, 
        marginLeft: 1,
        marginRight: 1,
        fontSize: 6, 
        wordWrap: "brake-word",
        textOverflow: "ellipsis",
    },
});

type GugaDocument = {
    generalData: cotizationGeneralData;
    equipments: cotizationEquipment[];
    prices: cotizationsPrices;
}
const GugaDocument: React.FC<GugaDocument> = ({generalData, equipments, prices})=> {
    
    return (
        <Document >
            <Page size={"LETTER"}  style={styles.page}>

                <View fixed>
                    <View style={{
                        position: "absolute",
                        width: 10, 
                        height: 660, 
                        left: 20,
                        top: 30,
                        backgroundColor: "#0095dc" }}>
                    </View>
                    <View style={{
                        position: "absolute",
                        width: 10, 
                        height: 660, 
                        left: 35,
                        top: 30,
                        backgroundColor: "#7f7f7f" }}>
                    </View>
                    <View style={{
                        position: "absolute",
                        width: 620, 
                        height: 23, 
                        top: 686.5,
                        backgroundColor: "#0095dd"}}>
                    </View>
                    <Image src={gugaLogoB64} style={styles.watermark}/>
                    <Image src={footerImage} style={styles.footer}/>
                </View> 
                <View style={styles.content}>
                    <View style={{
                        display: "flex",
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                    }}>
                        <Image src={gugaLogoB64} style={{height: 60}}/>
                    </View>
                    <View style={{
                        display: "flex",
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginTop: 25,
                        marginBottom: 25,
                        color: "#0094cf",
                    }}>
                        <Text>
                            GUGA EQUIPOS Y SERVICIOS S.A. DE C.V.
                        </Text>
                    </View>

                    {/*Datos Generales*/}
                    <View style={styles.table}> 
                        <View style={styles.tableRow}> 
                            <View style={{...styles.tableColHeader, width: "25%"}}> 
                                <Text style={styles.tableHeaderCell}>Cliente</Text> 
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
                            <View style={{...styles.tableColHeader, width: "10%"}}> 
                                <Text style={styles.tableHeaderCell}>Cotización</Text> 
                            </View> 
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{...styles.tableCol, width: "25%"}}> 
                                <Text style={styles.tableCell}>{generalData.companyName || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableCol, width: "13%"}}> 
                                <Text style={styles.tableCell}>{generalData.cellphone || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableCol, width: "25%"}}> 
                                <Text style={styles.tableCell}>{generalData.contactName || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableCol, width: "10%",}}> 
                                <Text style={styles.tableCell}>{generalData.creationDate || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableCol, width: "17%"}}> 
                                <Text style={styles.tableCell}>{generalData.referenceNumber || ""}</Text> 
                            </View> 
                            <View style={{
                                 display: "flex",
                                 flexWrap: "wrap",
                                 borderStyle: "solid", 
                                 borderWidth: 1, 
                                 borderColor:"#7f7f7f",
                                 borderLeftWidth: 0, 
                                 borderTopWidth: 0,
                                 textOverflow: "ellipsis", 
                                 width: "10%",
                                 backgroundColor: "#D4D4D4",
                                 textAlign: "center",
                            }}> 
                                <Text style={{
                                    margin: "auto", 
                                    marginTop: 1, 
                                    marginLeft: 1,
                                    marginRight: 1,
                                    fontSize: 6, 
                                    textOverflow: "ellipsis",
                                    color: "maroon",
                                }}>
                                    EyS-2000
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
                                <Text style={styles.tableHeaderCell}>Descuento ((%))</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "10%"}}> 
                                <Text style={styles.tableHeaderCell}>Moneda</Text> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "20%"}}> 
                                <Text style={styles.tableHeaderCell}>Agente Comercial</Text> 
                            </View>
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{...styles.tableCol, width: "35%"}}> 
                                <Text style={styles.tableCell}>{generalData.address || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableCol, width: "25%"}}> 
                                <Text style={styles.tableCell}>{generalData.email || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableCol, width: "10%"}}> 
                                <Text style={styles.tableCell}>{generalData.discount || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableCol, width: "10%", maxWidth: "10%"}}> 
                                <Text style={styles.tableCell}>{generalData.currency || ""}</Text> 
                            </View> 
                            <View style={{...styles.tableCol, width: "20%"}}> 
                                <Text style={styles.tableCell}>{generalData.comercialAgent || ""}</Text> 
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
                                    <View style={{...styles.tableColEquipment, width: "5%"}}> 
                                        <Text style={styles.tableCell}>{element.item || "  "}</Text> 
                                    </View> 
                                    <View style={{...styles.tableColEquipment, width: "20%"}}> 
                                        <Text style={styles.tableCell}>{element.reference || "  "}</Text> 
                                    </View> 
                                    <View style={{...styles.tableColEquipment, width: "30%"}}> 
                                        <Text style={styles.tableCell}>{element.description || "  "}</Text> 
                                    </View> 
                                    <View style={{...styles.tableColEquipment, width: "10%"}}> 
                                        <Text style={styles.tableCell}>{element.amount || "  "}</Text> 
                                    </View> 
                                    <View style={{...styles.tableColEquipment, width: "10%"}}> 
                                        <Text style={styles.tableCell}>{element.unit || "  "}</Text> 
                                    </View> 
                                    <View style={{...styles.tableColEquipment, width: "2.5%", borderRightWidth: 0,}}> 
                                        <Text style={styles.tableCell}>$</Text> 
                                    </View> 
                                    <View style={{...styles.tableColEquipment, width: "10%", borderLeftWidth: 0, textAlign: "right",}}> 
                                        <Text style={styles.tableCell}>{element.unitPrice || "  "}</Text> 
                                    </View> 
                                    <View style={{...styles.tableColEquipment, width: "2.5%",borderRightWidth: 0,}}> 
                                        <Text style={styles.tableCell}>$</Text> 
                                    </View> 
                                    <View style={{...styles.tableColEquipment, width: "10%", borderLeftWidth: 0,textAlign: "right",}}> 
                                        <Text style={styles.tableCell}>{element.totalPrice || "  "}</Text> 
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
                            <View style={{ width: "75%"}}> 
                            </View>  
                            <View style={{...styles.tableColHeader, width: "12.5%"}}> 
                                <Text style={styles.tableHeaderCell}>Importe</Text> 
                            </View> 
                            <View style={{...styles.tableColEquipment, width: "2.5%",borderRightWidth: 0,}}> 
                                <Text style={styles.tableCell}>$</Text> 
                            </View> 
                            <View style={{...styles.tableColEquipment, width: "10%", borderLeftWidth: 0,textAlign: "right",}}> 
                                <Text style={styles.tableCell}>{prices.amount || ""}</Text> 
                            </View> 
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{ width: "75%"}}> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "12.5%"}}> 
                                <Text style={styles.tableHeaderCell}>Descuento</Text> 
                            </View> 
                            <View style={{...styles.tableColEquipment, width: "2.5%",borderRightWidth: 0,}}> 
                                <Text style={styles.tableCell}>$</Text> 
                            </View> 
                            <View style={{...styles.tableColEquipment, width: "10%", borderLeftWidth: 0,textAlign: "right",}}> 
                                <Text style={styles.tableCell}>{prices.discount || ""}</Text> 
                            </View> 
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{ width: "75%"}}> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "12.5%"}}> 
                                <Text style={styles.tableHeaderCell}>Subtotal</Text> 
                            </View> 
                            <View style={{...styles.tableColEquipment, width: "2.5%",borderRightWidth: 0,}}> 
                                <Text style={styles.tableCell}>$</Text> 
                            </View> 
                            <View style={{...styles.tableColEquipment, width: "10%", borderLeftWidth: 0,textAlign: "right",}}> 
                                <Text style={styles.tableCell}>{prices.subtotal || ""}</Text> 
                            </View> 
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{ width: "75%"}}> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "12.5%"}}> 
                                <Text style={styles.tableHeaderCell}>Iva (16%)</Text> 
                            </View> 
                            <View style={{...styles.tableColEquipment, width: "2.5%",borderRightWidth: 0,}}> 
                                <Text style={styles.tableCell}>$</Text> 
                            </View> 
                            <View style={{...styles.tableColEquipment, width: "10%", borderLeftWidth: 0, textAlign: "right",}}> 
                                <Text style={styles.tableCell}>{prices.iva || ""}</Text> 
                            </View> 
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{ width: "75%"}}> 
                            </View> 
                            <View style={{...styles.tableColHeader, width: "12.5%"}}> 
                                <Text style={styles.tableHeaderCell}>TOTAL</Text> 
                            </View> 
                            <View style={{...styles.tableColEquipment, width: "2.5%",borderRightWidth: 0,}}> 
                                <Text style={styles.tableCell}>$</Text> 
                            </View> 
                            <View style={{...styles.tableColEquipment, width: "10%", borderLeftWidth: 0, textAlign: "right",}}> 
                                <Text style={styles.tableCell}>{prices.total || ""}</Text> 
                            </View> 
                        </View>
                    </View>
                    {/*Monto*/}
                    <View style={{...styles.table, marginTop: 15}}>
                        <View style={styles.tableRow}> 
                            <View style={{...styles.tableColHeader, width: "100%"}}> 
                                <Text style={styles.tableHeaderCell}>MONTO EN LETRA </Text> 
                            </View> 
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{...styles.tableColHeader, width: "100%"}}> 
                                <Text style={styles.tableHeaderCell}>PESOS CON 00/100 M.N</Text> 
                            </View> 
                        </View>
                    </View>
                    {/*Condiciones comerciales*/}
                    <View style={{...styles.table, marginTop: 15}}>
                        <View style={styles.tableRow}> 
                            <View style={{...styles.tableColHeader, width: "100%"}}> 
                                <Text style={styles.tableHeaderCell}>Condiciones comerciales </Text> 
                            </View> 
                        </View>
                        <View style={styles.tableRow}> 
                            <View style={{...styles.tableCol, width: "100%"}}> 
                                <Text style={styles.tableCell}>
                                    {generalData.comercialConditions || ""}
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
