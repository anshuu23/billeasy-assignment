import {  Response , Request , NextFunction  } from "express";
import { CustomError  } from "../util";
import { json } from "stream/consumers";
import { defaultRes , PathDosentExistError } from "../util";
import  jwt  from "jsonwebtoken";
import { getEnvVariables } from "../../getEnv";

const SECRET_KEY = getEnvVariables().SECRET_KEY as string

function defaultErr(err : any ,  req : Request , res : Response  , next :NextFunction ){

    if (err instanceof CustomError || err instanceof PathDosentExistError) {
      
        res.status(err.statusCode).json({ 
            msg: err.message,
            error: err
        });
    }
    else {
       
        res.status(500).json({
            msg: 'An unexpected error occurred.',
            error: 'Internal Server Error'
        });
    }

    // console.log("err came in default err fun" , err)
    // res.status(401).json({ error : err })
}


function wrongPath(  req : Request , res : Response  , next :NextFunction ){
    
    if (!res.headersSent) {

        const error = new PathDosentExistError('path does no exist , go home' , 404)
         
        next(error); // Pass the error to the error handler
    } else {
        next(); // Continue without modifying the response
    }
}


export {defaultErr , checkAuth , wrongPath}