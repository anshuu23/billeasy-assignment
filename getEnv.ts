import  dotenv  from "dotenv" 
dotenv.config()

//exporting all environment variables from one place
function getEnvVariables(){
    const PORT = process.env.PORT
    return {
        PORT 
    }
}

export {getEnvVariables}