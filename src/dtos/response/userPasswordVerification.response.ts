import { Property } from "@tsed/schema";
import { UserPasswordVerification } from "../../models/userPasswordVerification";
import { User } from "src/models/user";
import { UserResponse } from "./user.response";

export class UserPasswordVerificationResponse implements UserPasswordVerification {
  @Property()
  id!: string;

  @Property()
  verificationToken!: string;

  @Property()
  userId!: string;

  @Property(() => UserResponse)
  user: User;

  @Property()
  passwordChanged!: boolean;

  @Property()
  createAt!: Date;

  @Property()
  expiresAt!: Date;
}
