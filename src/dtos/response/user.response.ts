// Create a response model for user using the user model 

import { Property } from '@tsed/schema';
import { User } from '../../models/user';
import { Role } from '../../models/role';
import { RoleResponse } from './role.response';
import { Ownership } from 'src/models/ownership';

export class UserResponse implements User {
    @Property()  
    id!: string;

    @Property()
    username: string;
    
    @Property()
    email: string;

    @Property()
    password: string;
    
    @Property()
    tag: string;

    @Property()
    roleId: string;

    @Property(() => RoleResponse)
    role: Role;

    @Property()
    ownership: Ownership[];

    @Property()
    balance: number;

    @Property()
    isVerified: boolean;

    @Property()
    isActive: boolean;

    @Property()
    createAt: Date;

    @Property()
    updateAt: Date;

}
