import express from "express";
import { validateCreateAccountReq , validateUserLoginReq} from "../util";


const router = express.Router()
import { AuthController } from "../controller";

router.post('/createAccount' , validateCreateAccountReq , AuthController.HandelCreateUserAccount)

router.post('/loginUser' , validateUserLoginReq, AuthController.HandelUserLogin)

export default router