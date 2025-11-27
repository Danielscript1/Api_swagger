import { Request, Response } from 'express';
import { PrismaUserRepository } from "../../repositories/prisma-users-repository";
import { RegisterDTO } from "./register.dto";
import { hash } from 'bcryptjs';
import { checkSignupRateLimit } from '../../infra/utils/checkSignupRateLimit';
import { publishEmployeeCreated } from '../../messaging/producers/register-producer';



export async function register(req: Request, res: Response){


    const user: RegisterDTO = req.body

    try {
       await checkSignupRateLimit(req)  
       const registerUser = new PrismaUserRepository() 
      
       const userWithSameEmail =  await registerUser.findByEmail(user.email)
    
       if(userWithSameEmail){
            throw new Error('E-mail already exists. ')
       }

      const password_hash = await hash(user.password, 6)
       
        const newUser = await registerUser.createUser({
            name: user.name,
            password: password_hash,
            email: user.email,
            document: user.document,
            phone: user.phone
        }) 


         await publishEmployeeCreated(newUser)

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

        return res.status(error.statusCode).json({
            message: 'Erro ao criar usuário',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        })
    }

} 