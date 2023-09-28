import {Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import {AppDataSource} from '../data-source'
import * as bcrypt from 'bcryptjs'
import {User} from '../entity/User'
const dotenv = require('dotenv');
dotenv.config();

class AuthController {
    static login = async (req: Request, res: Response) => {
        // check if username and password are sent
        let {username, password} = req.body 
        if (!(username && password)) return res.sendStatus(400) // Bad request

        const userRepository = AppDataSource.getRepository(User)
        try {
            const foundUser = await userRepository.findOneBy({username})
            if (!foundUser) return res.sendStatus(401)

            const pwdMatch = await bcrypt.compare(password, foundUser.password)
            if (pwdMatch) {
                // generate jwt token
                const accessToken = jwt.sign(
                    {username: foundUser.username},
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30s' }
                )
                const refreshToken = jwt.sign(
                    {username: foundUser.username},
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '1d' }
                )
                foundUser.refreshToken = refreshToken
                await userRepository.save(foundUser)

                return res.json({ accessToken })
            } else {
                res.sendStatus(401)
            }
        } catch (err) {
            res.status(500).json({status: err, message: err.message})
        }
    }
}
 

export default AuthController;

