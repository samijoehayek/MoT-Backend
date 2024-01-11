// Create a response model for user using the user model 

import { Property } from '@tsed/schema';
import { User } from '../../models/user';
import { Role } from '../../models/roles';
import { RoleResponse } from './role.response';

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
    isActive: boolean;

    @Property()
    createAt: Date;

    @Property()
    updateAt: Date;

}
