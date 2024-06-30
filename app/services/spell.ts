const UNITS = [
    '', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 
    'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 
    'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'
];

const TENS = [
    '', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'
];

const HUNDREDS = [
    '', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'
];

const THOUSANDS = [
    '', 'mil', 'millón', 'mil millones', 'billón'
];

const CURRENCY = [
    'pesos', 'dólares', 
]

function convertUnits(num: number): string {
    return UNITS[num];
}

function convertTens(num: number): string {
    if (num < 30) {
        return UNITS[num];
    }
    const tens = Math.floor(num / 10);
    const remainder = num % 10;
    if (remainder === 0) {
        return TENS[tens];
    }
    return `${TENS[tens]} y ${UNITS[remainder]}`;
}

function convertGroup(num: number): string {
    if (num === 0) {
        return '';
    }
    return convertHundreds(num);
}


function convertHundreds(num: number): string {
    if (num < 100) {
        return convertTens(num);
    }
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    if (hundreds === 1 && remainder === 0) {
        return 'cien';
    }
    if (hundreds === 1) {
        return `ciento ${convertTens(remainder)}`;
    }
    return `${HUNDREDS[hundreds]} ${convertTens(remainder)}`.trim();
}
function getCurrencyString(currency: string): string{
    if(currency === "USD"){
        return  "dólares";
    } else if(currency === "M.N."){
        return "pesos";
    }
}

function getUnitCurrencyString(currency: string): string{
    if(currency === "USD"){
        return  "dólar";
    } else if(currency === "M/N"){
        return "peso";
    }
}
export function numberToWords(full_num: number, currency:string): string {
    let num = Math.floor(full_num)
    const decimals = full_num.toFixed(2).toString().split(".")[1];
    if (num <= 0) {
        return `cero ${getCurrencyString(currency)} con ${decimals}/100 ${currency}`.toUpperCase();
    } else if ( Math.floor(num) === 1){
        return `un ${getUnitCurrencyString(currency)} con ${decimals}/100 ${currency}`.toUpperCase();
    }

    let words = '';
    let scale = 0;

    while (num > 0) {
        const group = num % 1000;
        if (group !== 0) {
            const groupWords = convertGroup(group);
            const scaleWord = THOUSANDS[scale];
            if (scale === 1 && group === 1) {
                words = `${scaleWord} ${words}`.trim();
            } else if (scale > 1 && group === 1) {
                words = `un ${scaleWord} ${words}`.trim();
            } else if (scale > 1 && group > 1) {
                words = `${groupWords} ${scaleWord}es ${words}`.trim();
            } else {
                words = `${groupWords} ${scaleWord} ${words}`.trim();
            }
        }
        num = Math.floor(num / 1000);
        scale++;
    }


    return `${words} ${getCurrencyString(currency)} con ${decimals}/100 ${currency}`.toUpperCase();
}