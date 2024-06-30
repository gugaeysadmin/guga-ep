
import * as bcrypt from 'bcryptjs';

export const securePassword = async (passphrase: string) => {
    try {
        const hashedPassword = bcrypt.hashSync(passphrase, bcrypt.genSaltSync(10));
        console.log(hashedPassword)
        return hashedPassword.toString();
    } catch(err){
        console.log(err);
    }
}

export const verifyPassword = async (passphrase: string, hashedPassphrase: string) => {
    try {
        const match = await bcrypt.compare(passphrase, hashedPassphrase);
        return match;
    } catch(err) {
        console.log(err);
        throw err; 
    }
}
