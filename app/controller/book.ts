import { Request, Response, NextFunction } from "express";
import { defaultRes, CustomError } from "../util";
import { checkValidation } from "../helper";
import { addBook, addReview, deleteReview, getBooks, getBooksById, isBookExist, isReviewExist, searchBooks, updateReview } from "../repository";

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

//allows sorting and pagination
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

    try {

        //to check if express-validator have send some err
        checkValidation(req)

        const bookId = req.params.id as string;

        const isBookExistRes = await isBookExist(bookId)

        if (!isBookExistRes) {
            throw new CustomError("book with this id does not exist", 404)
        }
        const { currentPage, take, } = req.query as {
            currentPage: string;
            take: string;
        };

        let parsedTake = Number(take)

        let parsedCurrentPage = Number(currentPage);

        let skip = (parsedCurrentPage - 1) * parsedTake

        const getBooksByIdRes = await getBooksById(bookId, isNaN(skip) ? 0 : skip, isNaN(parsedTake) ? 10 : parsedTake)

        const dataToSend = {
            book: isBookExistRes,
            rating: getBooksByIdRes.averageRating._avg.rating,
            reviews: getBooksByIdRes.reviews
        }

        defaultRes(res, 200, "data retrived successfully", dataToSend)

    }
    catch (error) {
        console.log(error)
        next(error)
    }

}

async function handelAddReview(req: Request, res: Response, next: NextFunction) {

    try {

        //to check if express-validator have send some err
        checkValidation(req)

        const { rating, reviewText } = req.body as {
            rating: string,
            reviewText: string,
        };
        const userId: string = req.user.userId

        const parsedRating = parseInt(rating)

        const BookId = req.params.id as string;

        const isReviewExistRes = await isReviewExist(BookId, userId)

        if (isReviewExistRes) {
            throw new CustomError("review to this book is alredy made", 409)
        }

        const addBookRes = await addReview(BookId, userId, parsedRating, reviewText)

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

        const { rating, reviewText } = req.body as {
            rating: string,
            reviewText: string,
        };
        const userId: string = req.user.userId

        const parsedRating = parseInt(rating)

        const BookId = req.params.id as string;

        const isReviewExistRes = await isReviewExist(BookId, userId)

        if (!isReviewExistRes) {
            throw new CustomError("review to this book havent made", 409)
        }


        const addBookRes = await updateReview(BookId, userId, parsedRating, reviewText)

        defaultRes(res, 200, "book review updated successfully", addBookRes)

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

        const userId: string = req.user.userId

        const BookId = req.params.id as string;

        console.log(BookId , userId)
        const isReviewExistRes = await isReviewExist(BookId, userId)

        if (!isReviewExistRes) {
            throw new CustomError("Review not found", 404);
        }

        if (isReviewExistRes.userId !== userId) {
            throw new CustomError("You cannot delete someone else's review", 403);
        }


        const addBookRes = await deleteReview(BookId, userId)

        defaultRes(res, 200, "review deleted successfully", addBookRes)

    }
    catch (error) {
        console.log(error)

        //sending err in next() so it will catch in default err middleware in main index file
        next(error)
    }

}

async function handelSearchBooks(req: Request, res: Response, next: NextFunction) {

    try {

        //to check if express-validator have send some err
        checkValidation(req)

        const { title, author } = req.query as {
            title?: string;
            author?: string;
        };
        const whereClause: any = {};


        if (title) {
            whereClause.title = {
                contains: title,
                mode: "insensitive"
            };
        }

        if (author) {
            whereClause.author = {
                contains: author,       // Partial match on genre too (optional)
                mode: "insensitive"
            };
        }

        console.log(whereClause)
        console.log(title, author)
        const searchBooksRes = await searchBooks(whereClause)

        defaultRes(res, 200, "data retrived successfully", searchBooksRes)

    }
    catch (error) {
        console.log(error)

        //sending err in next() so it will catch in default err middleware in main index file
        next(error)
    }

}

export { HandelAddBook, handelGetAllBooks, handelGetBookBasedOnId, handelAddReview, handelUpdateReview, handelDeleteReview, handelSearchBooks }

