import {Response} from "express"
import { param } from "express-validator"
const {body} = require("express-validator")

const validateCreateAccountReq  = [

    body('userName').notEmpty().trim().withMessage('pls send user name') ,
    body('userName').isLength({min : 5 , max : 30}).withMessage('userName size should be between 5 and 30') ,
    
    body('userEmail').notEmpty().withMessage('pls send user email') ,
    body('userEmail').isEmail().trim().withMessage('pls send valid email') ,
    
    body('userPassword').notEmpty().withMessage('pls send user password') ,
    body('userPassword').isLength({min : 5 , max : 30}).trim().withMessage('userPassword size should be between 5 and 30') ,

]

const validateUserLoginReq  = [
   
    body('userEmail').notEmpty().withMessage('pls send user email') ,
    body('userEmail').isEmail().trim().withMessage('pls send valid email') ,
    
    body('userPassword').notEmpty().trim().withMessage('pls send user password') ,
    body('userPassword').isLength({min : 5 , max : 30}).withMessage('userName size should be between 5 and 30') ,
    
]

const validateAddBooksReq  = [
   
    body('title').notEmpty().trim().withMessage('pls send title') ,
    body('author').notEmpty().trim().withMessage('pls send author') ,
    body('genre').notEmpty().trim().withMessage('pls send genre') ,

]

const validateGetBooksWithIdReq  = [

    param('id').notEmpty().trim().withMessage('pls send book id') ,

]
const validatepostReview  = [

    param('id').notEmpty().trim().withMessage('pls send book id') ,
    body('rating').notEmpty().trim().withMessage('pls send rating') ,
    body('reviewText').notEmpty().trim().withMessage('pls send reviewText') ,
]
const validateDeleteReview  = [
    param('id').notEmpty().trim().withMessage('pls send review id') ,

]

//this function is used to response all apis so that response in send in same format
function defaultRes(
    res : Response,
    status : number,
    msg : string , 
    data ? : any
){
    return res.status(status).json({
        status : status ,
        message : msg,
        data : data || null ,
        
    })
}

//common custom err class so that error is send in same format
class CustomError extends Error {
    statusCode: number;
    message: any ;

    constructor(message: any, statusCode: number) {
        super(message); 
        this.statusCode = statusCode;
        this.message = message;
    }

}

//class for sending err message when path does not exist
class PathDosentExistError extends Error {
    statusCode: number;
    message: any ;

    constructor(message: any, statusCode: number) {
        super(message); 
        this.statusCode = statusCode;
        this.message = message;
    }

}



export  {validateCreateAccountReq , validateUserLoginReq , validateAddBooksReq ,validateGetBooksWithIdReq , validatepostReview ,validateDeleteReview , defaultRes , CustomError, PathDosentExistError }