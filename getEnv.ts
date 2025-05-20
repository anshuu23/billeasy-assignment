import  dotenv  from "dotenv" 
dotenv.config()

//exporting all environment variables from one place
function getEnvVariables(){
    const PORT = process.env.PORT
    const SECRET_KEY = process.env.SECRET_KEY
    return {
        PORT,
        SECRET_KEY
    }
}

export {getEnvVariables}