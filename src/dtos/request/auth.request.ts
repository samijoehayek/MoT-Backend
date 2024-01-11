import { Property } from "@tsed/schema";

export class LoginRequest {
    @Property()
    username: string;

    @Property()
    password: string;
}

export class ChangePasswordRequest {
    @Property()
    oldPassword: string;

    @Property()
    newPassword: string;
}