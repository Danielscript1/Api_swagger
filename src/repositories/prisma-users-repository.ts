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
} 