import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

//function to create account, return details of account created account
async function createAccount(userName: string, userEmail: string, userPassword: string) {

    return await prisma.user.create({
        data: {
            userName,
            userEmail,
            userPassword
        },
        select: {
            userEmail: true,
            userName: true,
            id: true
        }

    })
}

//checks if user exist, if does returns user data else null
async function isUserExist(userEmail: string) {

    return await prisma.user.findUnique({
        where: {
            userEmail
        }
    })
}

async function addBook(title: string, author: string, genre: string) {

    return await prisma.book.create({
        data: {
            title,
            author,
            genre
        },
    })
}


async function getBooks(skip: number, orderByy: string, sortIn: string, take: number, whereClause: any) {

    console.log('-------', skip, orderByy, sortIn, take, whereClause)
    const count = await prisma.book.count({
        where: whereClause
    })
    const data = await prisma.book.findMany({
        skip,
        take,
        orderBy: {
            [orderByy]: sortIn
        },
        where: whereClause
    })

    return { count, data }
}

async function getBooksById(id : string,skip: number, take: number) {

   const averageRating = await prisma.review.aggregate({
      where: { bookId:id },
      _avg: { rating: true },
    });

    // Get paginated reviews
    const reviews = await prisma.review.findMany({
      where: { bookId: id },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { userName: true } }, // If you want to show who reviewed
      },
    });


    return { averageRating, reviews }
}

async function isBookExist(id : string) {
   return await prisma.book.findUnique({
        where: {
            id
        },
    })
}

async function isReviewExist(bookId: string, userId: string) {

    return await prisma.review.findUnique({
        where: {
            bookId_userId: {
                bookId,
                userId,
            },
        },
    })
}


async function addReview(bookId: string, userId: string, rating: number, reviewText: string) {

    return await prisma.review.create({
        data: {
            bookId,
            userId,
            rating,
            reviewText
        },
    })
}

async function updateReview(bookId: string, userId: string, rating: number, reviewText: string) {

    return await prisma.review.update({
        where: {
            bookId_userId: {
                bookId,
                userId
            }
        },
        data: {
            rating,
            reviewText
        }
    })
}
async function deleteReview(bookId: string, userId: string) {

    return await prisma.review.delete({
        where: {
            bookId_userId: {
                bookId,
                userId
            }
        },
    })
}

async function searchBooks(whereClause : any) {

    return await prisma.book.findMany({
        where:whereClause
    })
}

export { createAccount, isUserExist, addBook, getBooks, addReview, isReviewExist , updateReview , deleteReview , searchBooks , getBooksById , isBookExist}