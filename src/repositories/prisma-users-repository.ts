import { PrismaClient } from '../../prisma/generated/main/prisma/client';
import type { UserCreateInput } from '../../prisma/generated/main/prisma/models/User';

export class PrismaUserRepository{
    
    private prisma:PrismaClient

    constructor(){
        this.prisma = new PrismaClient()
    }
    
    async createUser(data: UserCreateInput) {
        
        const user = await this.prisma.user.create({
            data
        })
        return user
    }

    async findByEmail(email: string) {
        
        const userWithSameEmail = await this.prisma.user.findUnique({
            where:{
                email:email
            }, include: {
                role: true
            }
        })
        return userWithSameEmail
    }
} 