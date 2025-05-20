import express from "express"
import { getEnvVariables } from "./getEnv"

const app = express()

const PORT = getEnvVariables().PORT
app.listen(PORT , ()=>{
    console.log(`server is listening on port ${PORT}`)
})