import {Request, Response} from 'express';
import {AppDataSource} from '../data-source'
import {User} from '../entity/User'
import * as bcrypt from 'bcryptjs'

class RegisterController {
    static async register(req: Request, res: Response) {
        let {username, password} = req.body
        if (!(username && password)) return res.sendStatus(400) // Bad Request

        const userRepository = AppDataSource.getRepository(User)

        const duplicateUser = await userRepository.findOneBy({username})
        if (duplicateUser) return res.sendStatus(409) // Conflict

        try {
            const hashedPwd = await bcrypt.hash(password, 10)
            const user = new User()
            user.username = username
            user.password = hashedPwd
            user.refreshToken = null

            await userRepository.save(user) // save user
            res.status(201).json({status: 'success', message: 'User created successfully'})
        } catch (err){
            res.status(500).json({status: 'error', message: err.message})
        }
    }
}

export default RegisterController