import {Response} from "express"
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



export  {validateCreateAccountReq , validateUserLoginReq , defaultRes , CustomError, PathDosentExistError }