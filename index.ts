import express from "express"
import { getEnvVariables } from "./getEnv"
const PORT = getEnvVariables().PORT


const app = express()

app.use(cors())
app.use(express.json())
app.use('/' , router)

app.listen(PORT , ()=>{
    console.log(`server is listening on port ${PORT}`)
})

function cors(): any {
    throw new Error("Function not implemented.")
}
