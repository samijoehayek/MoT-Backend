import { Inject, Service } from "@tsed/di";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { EncryptionService } from "../encryption/encryption.service";
import { UserRequest } from "../../dtos/request/user.request";
import { UserResponse } from "../../dtos/response/user.response";
import { ChangePasswordRequest } from "../../dtos/request/auth.request";
import { User } from "../../models/user";
import { TransporterService } from "../../services/transporter.service";

@Service()
export class AuthService {
  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  @Inject(EncryptionService)
  protected encryptionService: EncryptionService;

  @Inject(TransporterService)
  protected transporterService: TransporterService;

  public async signup(payload: UserRequest): Promise<UserResponse> {
    // Check if user created email and password
    if (payload.email && payload.password) {
      payload.email = payload.email.toLowerCase();
      const encryptPassword = this.encryptionService.encryptMD5(payload.email + payload.password);
      payload.password = encryptPassword;
    }

    // save the user
    const user = await this.userRepository.save({ ...payload });

    // This is the email content being sent
    const html = '<p>Welcome to MoT</p>'
    await this.transporterService.sendEmail({ html, subject: "MindFlares: Welcome!", to: payload.email })

    return user;
  }


  public async changePassword(user: User, payload: ChangePasswordRequest): Promise<boolean> {
    console.log(user.email);
    const encrytedOldPassword = this.encryptionService.encryptMD5(user.email + payload.oldPassword);
    if (encrytedOldPassword !== user.password) throw new Error("Old password is incorrect");

    const encryptedPassword = this.encryptionService.encryptMD5(user.email + payload.newPassword);
    if(encryptedPassword === encrytedOldPassword) throw new Error("New password must be different from old password");

    await this.userRepository.update({ id: user.id }, { password: encryptedPassword });

    // This is the email content being sent
    const html = '<p>Password has been Changed</p>'
    await this.transporterService.sendEmail({ html, subject: "Success!!", to: user.email })

    return true;
  }
}
