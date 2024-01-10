// Same as the response file

import { Property } from '@tsed/schema';

export class UserRequest {
    @Property()  
    id?: string;

    @Property()
    username: string;
    
    @Property()
    email?: string;

    @Property()
    password?: string;

    @Property()
    isActive: boolean;

    @Property()
    createAt?: Date;

    @Property()
    updateAt?: Date;

}