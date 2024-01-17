import { Property } from "@tsed/schema";

export class UserVerficationRequest {
    @Property()
    id?: string;

    @Property()
    verificationToken?: string;

    @Property()
    userId?: string;

    @Property()
    createAt?: Date;

    @Property()
    expiresAt?: Date;

}