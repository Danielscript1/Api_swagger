import { Request, Response } from 'express';
import { PrismaUserRepository } from "../../repositories/prisma-users-repository";
import { RegisterDTO } from "./register.dto";

export async function register(req: Request, res: Response){

    const user: RegisterDTO = req.body

    try {
       const registerUser =  new PrismaUserRepository() 

        await registerUser.createUser({
            name:user.name,
            password:user.password,
            email:user.email,
            document:user.document,
            phone:user.phone
        }) 
    } catch (error) {
        return res.status(500).send({
            message: `error ao register user ${error}`
        })

    }
    
    return res.status(201).send({
        message:"user created"
    })

} 