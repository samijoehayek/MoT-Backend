import { BodyParams, Req } from "@tsed/common";
import { Inject } from "@tsed/di";
import { Conflict, NotAcceptable } from "@tsed/exceptions";
import { OnVerify, Protocol } from "@tsed/passport";
import * as jwt from "jsonwebtoken";
import { Strategy } from "passport-local";
import { AuthService } from "../app-services/auth/auth.service";
import { EncryptionService } from "../app-services/encryption/encryption.service";
import { envs } from "../config/envs/index";
import { UserRequest } from "../dtos/request/user.request";
import { USER_REPOSITORY } from "../repositories/user/user.repository";
import { ROLE_REPOSITORY } from "../repositories/role/role.repository";

@Protocol({
  name: "signup-passport",
  useStrategy: Strategy,
  settings: {
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
  }
})
export class SignupPassportProtocol implements OnVerify {
  @Inject(AuthService)
  protected service: AuthService;

  @Inject(ROLE_REPOSITORY)
  protected roleRepository: ROLE_REPOSITORY;

  @Inject(USER_REPOSITORY)
  userRespository: USER_REPOSITORY;

  @Inject(EncryptionService)
  protected encryptionService: EncryptionService;

  async $onVerify(@Req() req: Req, @BodyParams() payload: UserRequest) {
    console.log("Payload inside protocol: " +  payload)
    if (!payload.email || !payload.password) throw new NotAcceptable("Email and password are required");

    // Validate email format using class-validator
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(payload.email)) {
        throw new NotAcceptable("Invalid email format");
    }

    const found = await this.userRespository.findOne({
      where: [{ email: payload.email?.toLowerCase() }, { username: payload.username }]
    });
    if (found) throw new Conflict("Email or username already exists");

    // Check if the user chose a role of admin
    const isAdmin = await this.roleRepository.findOne({ where: { id: payload.roleId } });
    console.log(isAdmin);
    if(isAdmin?.roleName.toLowerCase() === "admin") {
      console.log("Entered the conditional statement")
      throw new NotAcceptable("You cannot create an admin account");
    }

    const user = await this.service.signup(payload);

    const token = jwt.sign(
      {
        iss: envs.JWT_ISSUER,
        aud: envs.JWT_AUDIENCE,
        sub: user.id,
        exp: Date.now() + Number(envs.JWT_EXPIRATION_AGE) * 1000
      },
      envs.JWT_KEY as string
    );
    return (req.user = { token, user });
  }
}
