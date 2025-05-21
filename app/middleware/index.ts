import {  Response , Request , NextFunction  } from "express";
import { CustomError  } from "../util";
import { PathDosentExistError } from "../util";
import  jwt  from "jsonwebtoken";
import { getEnvVariables } from "../../getEnv";

declare global {
  namespace Express {
    interface Request {
      user?: any 
    }
  }
}

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
}


function handleInvalidRoute(  req : Request , res : Response  , next :NextFunction ){
    
    if (!res.headersSent) {

        const error = new PathDosentExistError('path does no exist , go home' , 404)
         
        next(error);
    } else {
        next(); 
    }
}

  
function authenticateUser(req : Request  , res : Response , next : NextFunction){
    const authHeader = req?.headers?.authorization
   
    const token = authHeader?.split(" ")?.[1] as string

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new CustomError("unauthorized, pls enter valid token" , 400)
    }
  
    try{
        const jwtPayload = jwt.verify(token , SECRET_KEY)  
        req.user = jwtPayload 
    }
    catch(error){       
        throw new CustomError("invalid Token" , 400)
    }  
    
    next()
}


export {defaultErr , handleInvalidRoute , authenticateUser}