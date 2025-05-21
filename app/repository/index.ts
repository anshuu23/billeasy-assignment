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

async function addBook(title : string , author : string , genre : string){

    return await prisma.book.create({
        data:{
            title ,
            author,
            genre
        },
    })
}


 async function getBooks(skip: number, orderByy: string, sortIn: string, take: number , whereClause : any) {

    console.log('-------' ,  skip , orderByy , sortIn , take , whereClause )
    const count = await prisma.book.count({
        where : whereClause
    })
    const data = await prisma.book.findMany({
        skip,
        take,
        orderBy: {
            [orderByy]: sortIn
        },
        where : whereClause
    })

    return { count , data }
}

export {createAccount , isUserExist , addBook , getBooks}