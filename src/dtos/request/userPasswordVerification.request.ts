import { Property } from "@tsed/schema";

export class UserPasswordVerficationRequest {
    @Property()
    id?: string;

    @Property()
    verificationToken?: string;

    @Property()
    userId?: string;

    @Property()
    passwordChanged?: boolean;

    @Property()
    createAt?: Date;

    @Property()
    expiresAt?: Date;

}