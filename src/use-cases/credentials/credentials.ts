import { Request, Response } from 'express';
import { LoginDTO } from './credentials.dto';


export async function credentials(req: Request, res: Response) {
   
    const loginData: LoginDTO = req.body;

    
    const { email, password } = loginData;


    return res.json({
        success: true,
        message: "Autenticação realizada com sucesso",
        data: {
            email,
         
        }
    });
}