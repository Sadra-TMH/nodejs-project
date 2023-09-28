import * as express from "express"
import * as bodyParser from "body-parser"
import * as cors from "cors"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import routes from "./routes"
import { User } from "./entity/User"
import helmet from "helmet"

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(helmet())
    app.use(cors())
    app.use(bodyParser.json())

    app.use('/', routes)    

    app.listen(3000, () => {
        console.log('listening on port 3000')
    })

}).catch(error => console.log(error))
