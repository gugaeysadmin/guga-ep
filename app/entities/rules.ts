export const ValidationError = {
    required: "Campo requerido",
}

export const ValidationPatterns = {
    onlyText: {
        pattern: /^[a-zA-ZñÑÀ-ÿ,.\s]+$/,
        errorMessage: "Solo se permite texto"
    },
    onlyNumbers: {
        pattern: /^\d+$/,
        errorMessage: "Solo se permiten números"
    },
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessage: "Correo electronico no valido"
    },
    localPhone: {
        pattern: /^\d{10}$/,
        errorMessage: "Telefono a 10 digitos"
    },
    oneWord: {
        pattern: /^\S+$/,
    },
    openText: {
        pattern: /^[a-zA-ZÀ-ÿ0-9.,()#;W/\--_@¿?\s]*$/,
        errorMessage: "Solo se permiten los caracteres . , \ / - _ @ ¿?",
    }
}