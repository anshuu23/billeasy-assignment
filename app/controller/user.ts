import { Request , Response , NextFunction } from "express";
import { defaultRes , CustomError } from "../util";
import { checkValidation , hashPassword, unHashPassword } from "../helper";
import { createAccount , isUserExist } from "../repository";
import jwt from "jsonwebtoken"
import { getEnvVariables } from "../../getEnv";

const SECRET_KEY = getEnvVariables().SECRET_KEY  as string

// Function to create an account. First, it checks if the user already exists — if yes, it does not create the account. If the user does not exist, it proceeds to create the account.
async function HandelCreateUserAccount(req : Request , res : Response , next : NextFunction){

    try{

        //to check if express-validator have send some err
        checkValidation(req)

        const { userName, userEmail, userPassword }: { userName: string, userEmail: string, userPassword: string } = req.body;

        //checking if user exist
        const isUserExistRes = await isUserExist(userEmail)
       
        //throwing err if user exist
        if(isUserExistRes){
            throw new CustomError("user with this email already exist" , 409)
        }

        //hashing password using bcrypt
        const hashedPassword = await hashPassword(userPassword)

        const createAccountRes = await createAccount(userName , userEmail , hashedPassword)
        
        const dataTOMakeToken = {
            userId : createAccountRes.id,
            userName : createAccountRes.userName
        } 

        //making jwt
        const tokenToSend = jwt.sign( dataTOMakeToken , SECRET_KEY ,{expiresIn : '10m'})

        defaultRes(res , 200 , "user registered successfully" , null)       
        
    }
    catch(error){
        console.log(error)

        //sending err in next() so it will catch in default err middleware in main index file
        next(error)
    }
    
}


async function HandelUserLogin(req : Request , res : Response , next : NextFunction){

    try{

        //to check if express-validator have send some err
        checkValidation(req)

        const {userEmail, userPassword }: {  userEmail: string, userPassword: string } = req.body;

        //checking if user exist
        const isUserExistRes = await isUserExist(userEmail)

        //if user has given wrong email, err is thrown
        if(!isUserExistRes){
            throw new CustomError("account with this email dosent exist" , 400)
        }

        const plainPassword = userPassword ;
        const hashedPassword = isUserExistRes.userPassword;

        const isPasswordCorrect = await unHashPassword(plainPassword , hashedPassword)

        if(!isPasswordCorrect){
            throw new CustomError("wrong password" , 400)
        }

        const dataTOMakeToken = {
            userId : isUserExistRes.id,
            userName : isUserExistRes.userName
        } 
        const tokenToSend = jwt.sign( dataTOMakeToken , SECRET_KEY ,{expiresIn : '10m'})

        defaultRes(res , 200 , "account logged in , token generated" , {token : tokenToSend})

        
    }
    catch(error){
        console.log(error)
        next(error)
    }
    
}

export {HandelCreateUserAccount , HandelUserLogin }