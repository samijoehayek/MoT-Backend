// Create a response model for user using the user model 

import { Property } from '@tsed/schema';
import { User } from '../../models/user';

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
    isActive: boolean;

    @Property()
    createAt: Date;

    @Property()
    updateAt: Date;

}
