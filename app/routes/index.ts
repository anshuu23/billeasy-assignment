import express from "express";
import { validateCreateAccountReq , validateUserLoginReq} from "../util";


const router = express.Router()
import { UserController } from "../controller";

router.post('/signup' , validateCreateAccountReq , UserController.HandelCreateUserAccount)

router.post('/login' , validateUserLoginReq, UserController.HandelUserLogin)

export default router