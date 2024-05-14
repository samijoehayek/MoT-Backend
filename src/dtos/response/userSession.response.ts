import { Property } from "@tsed/schema";

export class UserSessionResponse {
    @Property()
    id?: string;

    @Property()
    userId?: string;

    @Property()
    sessionToken?: string;

    @Property()
    isActive?: boolean;
    
    @Property()
    createAt?: Date;

    @Property()
    lastPingAt?: Date;
}