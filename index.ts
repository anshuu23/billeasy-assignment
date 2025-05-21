import express from "express"
import { getEnvVariables } from "./getEnv"
import router from "./app/routes"
import cors from 'cors'
import { defaultErr, handleInvalidRoute } from "./app/middleware"
const PORT = getEnvVariables().PORT

const app = express()

app.use(cors())
app.use(express.json())

app.use('/' , router)

router.use(handleInvalidRoute)
router.use(defaultErr)

app.listen(PORT , ()=>{
    console.log(`server is listening on port ${PORT}`)
})
