import express from "express";
import { validateAddBooksReq, validateCreateAccountReq , validateDeleteReview, validateGetBooksWithIdReq, validatepostReview, validateUserLoginReq} from "../util";
import { UserController , BooksController } from "../controller";
import { authenticateUser } from "../middleware";

const router = express.Router()

router.post('/signup' , validateCreateAccountReq , UserController.HandelCreateUserAccount)

router.post('/login' , validateUserLoginReq, UserController.HandelUserLogin)

router.post('/books' , validateAddBooksReq, authenticateUser, BooksController.HandelAddBook)

router.get('/books' , BooksController.handelGetAllBooks)

router.get('/books/:id' ,validateGetBooksWithIdReq, BooksController.handelGetBookBasedOnId)

router.post('/books/:id/reviews' ,validatepostReview, authenticateUser, BooksController.handelAddReview)

router.put('/books/reviews/:id' , validatepostReview ,authenticateUser, BooksController.handelUpdateReview)

router.delete('/reviews/:id' ,validateDeleteReview, authenticateUser, BooksController.handelDeleteReview)

router.get('/search' , BooksController.handelSearchBooks)

export default router