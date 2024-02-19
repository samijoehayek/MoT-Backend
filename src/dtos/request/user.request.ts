// Same as the response file

import { Property } from '@tsed/schema';

export class UserRequest {
    @Property()  
    id?: string;

    @Property()
    username: string;
    
    @Property()
    email: string;

    @Property()
    password?: string;

    @Property()
    tag?: string;

    @Property()
    roleId?: string

    @Property()
    avatarId?: string;  

    @Property()
    createAt?: Date;

    @Property()
    updateAt?: Date;

}