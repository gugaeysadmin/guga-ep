import React, {useState, useEffect} from "react";
import { verifyPassword } from "../services/security";

export const usePassValidation= (password) => {
    const [isValid, setIsValid] = useState(false);
    const [hashedPassword, setHashedPassword] = useState("");
    const [validationMessage, setValidationMessage] = useState("");

    useEffect(() => {
        setIsValid(false);
        setValidationMessage("");
    },[password]);
    const validate = async (): Promise<boolean> => {
        if(!!!password){
            setIsValid(false);
            setValidationMessage("Campo obligatorio");
            return false;
        } else if (!!!hashedPassword) {
            setIsValid(false);
            setValidationMessage("Este usuario no tiene contraseña asignada");
            return false;
        } else {

           let result  = await verifyPassword(password, hashedPassword)
            if(result) {
                console.log(result);
                setIsValid(true);
                return true;
            } else {
                setIsValid(false);
                setValidationMessage("Contraseña incorrecta")
                return false;
            }
        }
    }

    return {
        isValid,
        validationMessage,
        setHashedPassword,
        validate
    }
}