import express from "express";
import { validateAddBooksReq, validateCreateAccountReq , validateUserLoginReq} from "../util";
import { UserController , BooksController } from "../controller";
import { authenticateUser } from "../middleware";

const router = express.Router()

router.post('/signup' , validateCreateAccountReq , UserController.HandelCreateUserAccount)

router.post('/login' , validateUserLoginReq, UserController.HandelUserLogin)

router.post('/books' , validateAddBooksReq, authenticateUser, BooksController.HandelAddBook)

router.get('/books' , BooksController.handelGetAllBooks)

router.get('/books:id' , BooksController.handelGetBookBasedOnId)

export default router