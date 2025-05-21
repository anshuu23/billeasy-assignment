import { Request, Response, NextFunction } from "express";
import { defaultRes, CustomError } from "../util";
import { checkValidation, hashPassword, unHashPassword } from "../helper";
import { addBook, addReview, createAccount, deleteReview, getBooks, isReviewExist, isUserExist, updateReview } from "../repository";
import jwt from "jsonwebtoken"
import { getEnvVariables } from "../../getEnv";
import { UUID } from "crypto";

const SECRET_KEY = getEnvVariables().SECRET_KEY as string

// Function to create an account. First, it checks if the user already exists — if yes, it does not create the account. If the user does not exist, it proceeds to create the account.
async function HandelAddBook(req: Request, res: Response, next: NextFunction) {

    try {

        //to check if express-validator have send some err
        checkValidation(req)

        const { title, author, genre }: { title: string, author: string, genre: string } = req.body;

        const addBookRes = await addBook(title, author, genre)

        defaultRes(res, 200, "new book added successfully", addBookRes)

    }
    catch (error) {
        console.log(error)

        //sending err in next() so it will catch in default err middleware in main index file
        next(error)
    }

}


async function handelGetAllBooks(req: Request, res: Response, next: NextFunction) {
    try {

        const { currentPage, orderBy, sortInn, take, genre, author } = req.query as {
            currentPage: string;
            orderBy: string;
            sortInn: string;
            take: string;
            genre: string;
            author: string
        };

        let parsedTake = Number(take)

        let parsedCurrentPage = Number(currentPage);

        let skip = (parsedCurrentPage - 1) * parsedTake

        const whereClause: any = {};
        if (author) whereClause.author = author;
        if (genre) whereClause.genre = genre;
        orderBy ? orderBy : 'id'

        console.log('hiiii--------', orderBy, sortInn)

        const getBooksRes = await getBooks(isNaN(skip) ? 0 : skip, orderBy ?? 'title', sortInn ?? 'asc', isNaN(parsedTake) ? 10 : parsedTake, whereClause)

        defaultRes(res, 200, "books retrived successfully", getBooksRes)

    }
    catch (error) {
        console.log(error)

        //sending err in next() so it will catch in default err middleware in main index file
        next(error)
    }
}

async function handelGetBookBasedOnId(req: Request, res: Response, next: NextFunction) {

    // try {

    //     //to check if express-validator have send some err
    //     checkValidation(req)

    //     const { id }: { id: UUID } = req.params;

    //     const addBookRes = await addBook(title, author, genre)

    //     defaultRes(res, 200, "new book added successfully", addBookRes)

    // }
    // catch (error) {
    //     console.log(error)

    //     //sending err in next() so it will catch in default err middleware in main index file
    //     next(error)
    // }

}

async function handelAddReview(req: Request, res: Response, next: NextFunction) {

    try {

        //to check if express-validator have send some err
        checkValidation(req)

        const {  rating, reviewText } = req.body as {
            rating: string,
            reviewText: string,
        };
        const userId : string = req.body.user.userId

        const parsedRating = parseInt(rating)

        const BookId = req.params.id as string;

        const isReviewExistRes = await isReviewExist(BookId , userId)

        if(isReviewExistRes){
            throw new CustomError("review to this book is alredy made" , 409)
        }

        const addBookRes = await addReview(BookId , userId, parsedRating, reviewText )

        defaultRes(res, 200, "book review added successfully", addBookRes)

    }
    catch (error) {
        console.log(error)

        //sending err in next() so it will catch in default err middleware in main index file
        next(error)
    }

}

async function handelUpdateReview(req: Request, res: Response, next: NextFunction) {

    try {

        //to check if express-validator have send some err
        checkValidation(req)

        const {  rating, reviewText } = req.body as {
            rating: string,
            reviewText: string,
        };
        const userId : string = req.body.user.userId

        const parsedRating = parseInt(rating)

        const BookId = req.params.id as string;

        const isReviewExistRes = await isReviewExist(BookId , userId)

        if(!isReviewExistRes){
            throw new CustomError("review to this book havent made" , 409)
        }


        const addBookRes = await updateReview(BookId , userId, parsedRating, reviewText )

        defaultRes(res, 200, "book review added successfully", addBookRes)

    }
    catch (error) {
        console.log(error)

        //sending err in next() so it will catch in default err middleware in main index file
        next(error)
    }

}

async function handelDeleteReview(req: Request, res: Response, next: NextFunction) {

    try {

        //to check if express-validator have send some err
        checkValidation(req)

        const userId : string = req.body.user.userId

        const BookId = req.params.id as string;

        const isReviewExistRes = await isReviewExist(BookId , userId)

        if(!isReviewExistRes){
            throw new CustomError("cant delete review as it does not exist" , 409)
        }

        const addBookRes = await deleteReview(BookId , userId)

        defaultRes(res, 200, "review deleted successfully", addBookRes)

    }
    catch (error) {
        console.log(error)

        //sending err in next() so it will catch in default err middleware in main index file
        next(error)
    }

}

export { HandelAddBook, handelGetAllBooks, handelGetBookBasedOnId, handelAddReview , handelUpdateReview , handelDeleteReview}

