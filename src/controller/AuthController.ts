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
                
                res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'None', secure: true})
                res.json({ accessToken })
            } else {
                res.sendStatus(401)
            }
        } catch (err) {
            res.status(500).json({status: err, message: err.message})
        }
    }

    static logout = async (req: Request, res: Response) => {
        // check if username and password are sent
        let cookies = req.cookies 
        if (!cookies?.jwt) return res.sendStatus(204) // no content
        let refreshToken = cookies.jwt

        const userRepository = AppDataSource.getRepository(User)
        try {
            const foundUser = await userRepository.findOneBy({refreshToken})
            if (!foundUser) {
                res.cookie('jwt', {httpOnly: true, expires: +Date() - 1000, sameSite: 'None', secure: true})
                return res.sendStatus(204)
            } else {
                foundUser.refreshToken = null;
                userRepository.save(foundUser)

                res.clearCookie('jwt', {httpOnly: true, expires: +Date() - 1000, sameSite: 'None', secure: true})
                return res.sendStatus(204)
            }
           
        } catch (err) {
            res.status(500).json({status: err, message: err.message})
        }
    }    

    static refreshToken = async (req: Request, res: Response) => {
        // check if username and password are sent
        let cookies = req.cookies 
        if (!cookies?.jwt) return res.sendStatus(401) // Unauthorized
        let refreshToken = cookies.jwt

        const userRepository = AppDataSource.getRepository(User)
        try {
            const foundUser = await userRepository.findOneBy({refreshToken})
            if (!foundUser) return res.sendStatus(403)

            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, decoded) => {
                    if (err || foundUser.username !== decoded.username) return res.sendStatus(403)
                    const accessToken = jwt.sign(
                        {username: decoded.username},
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '30s' }
                    )
                    res.json({ accessToken })
                }
            )

            
            
        } catch (err) {
            res.status(500).json({status: err, message: err.message})
        }
    }

    static changePassword = async (req: Request, res: Response) => {
        // check if password is sent
        let {password, newPassword} = req.body
        let username = req?.user
        if (!(username && password)) return res.sendStatus(400) // Bad request

        const userRepository = AppDataSource.getRepository(User)

        try {
            const foundUser = await userRepository.findOneBy({username})
            if (!foundUser) return res.sendStatus(401)

            const pwdMatch = await bcrypt.compare(password, foundUser.password)
            if (pwdMatch) {
                const hashedPwd = await bcrypt.hash(newPassword, 10)
                foundUser.password = hashedPwd
                userRepository.save(foundUser)
                res.json({status: 'success', message: 'Password changed successfully.'})
            } else {
                res.sendStatus(401)
            }
        } catch (err) {
            res.status(500).json({status: err, message: err.message})
        }


    }
}
 

export default AuthController;

