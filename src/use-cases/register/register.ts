import { Request, Response } from 'express';
import { PrismaUserRepository } from "../../repositories/prisma-users-repository";
import { RegisterDTO } from "./register.dto";

export async function register(req: Request, res: Response){

    const user: RegisterDTO = req.body

    try {
       const registerUser = new PrismaUserRepository() 

        const newUser = await registerUser.createUser({
            name: user.name,
            password: user.password,
            email: user.email,
            document: user.document,
            phone: user.phone
        }) 

        return res.status(201).json({
            message: "user created",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        })
    } catch (error: any) {
       
        if (error?.code === 'P2002') {
            return res.status(409).json({
                message: 'Email já está em uso',
                error: 'Email already exists'
            })
        }

        console.error('Error creating user:', error)
        return res.status(500).json({
            message: 'Erro ao criar usuário',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        })
    }

} 