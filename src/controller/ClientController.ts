import {Request, Response} from 'express';
import {AppDataSource} from '../data-source'
import {User} from '../entity/User'
import * as bcrypt from 'bcryptjs'

class ClientController {
    static async create(req: Request, res: Response) {
        console.log('create');
        res.sendStatus(200)
        
    }
}

export default ClientController