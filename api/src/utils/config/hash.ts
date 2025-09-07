import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = Number(10);
const ACCESS_TOKEN_EXP = "15m";
export const REFRESH_TOKEN_EXP = 60 * 60 * 24 * 7; //7 days in second

export const hashPassword = async(plain:string) =>{
    return bcrypt.hash(plain,SALT_ROUNDS);
}

export const comparePassword = async(plain:string,hash:string) =>{
    return bcrypt.compare(plain,hash);
};
