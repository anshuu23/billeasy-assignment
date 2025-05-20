import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

//function to create account, return details of account created account
async function createAccount(userName : string , userEmail : string , userPassword : string){

    return await prisma.user.create({
        data:{
            userName,
            userEmail,
            userPassword
        },
        select:{
            userEmail : true,
            userName : true,
            id : true
        }
        
    })
}

//checks if user exist, if does returns user data else null
async function isUserExist( userEmail : string ){

    return await prisma.user.findUnique({
        where:{
            userEmail 
        }
    })
}


export {createAccount , isUserExist }