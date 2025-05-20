const { validationResult } = require("express-validator");
import bcrypt from "bcrypt"
import { CustomError } from "../util";
import { Request } from "express";

//function to check if express validator have thrown some err. if there are err ,I pass it to custom err 
 const checkValidation = (req: Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError(errors.errors , 400)
  }
};

//hashing password using bcrypt, returns hashed password
async function hashPassword(plainPassword : string){
 return await bcrypt.hash(plainPassword , 10)
}

//un-hashing password using bcrypt, returns booean value
async function unHashPassword(plainPassword : string , hashedPassword : string){
 return await bcrypt.compare(plainPassword , hashedPassword)
}

export  {checkValidation , hashPassword , unHashPassword}
