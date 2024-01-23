import { Inject, Service } from "@tsed/di";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { EncryptionService } from "../encryption/encryption.service";
import { UserRequest } from "../../dtos/request/user.request";
import { UserResponse } from "../../dtos/response/user.response";
import { ChangePasswordRequest } from "../../dtos/request/auth.request";
import { User } from "../../models/user";
import { TransporterService } from "../../services/transporter.service";
import { v4 as uuidv4 } from "uuid";
import { USER_VERIFICATION_REPOSITORY } from "../../repositories/userVerification/userVerification.repository";

@Service()
export class AuthService {
  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  @Inject(USER_VERIFICATION_REPOSITORY)
  protected userVerificationRepository: USER_VERIFICATION_REPOSITORY;

  @Inject(EncryptionService)
  protected encryptionService: EncryptionService;

  @Inject(TransporterService)
  protected transporterService: TransporterService;

  public async signup(payload: UserRequest): Promise<UserResponse> {
    const currentUrl = "http://localhost:8083";
    const uniqueString = uuidv4();

    // Check if user created email and password
    if (payload.email && payload.password) {
      payload.email = payload.email.toLowerCase();
      const encryptPassword = this.encryptionService.encryptMD5(payload.email + payload.password);
      payload.password = encryptPassword;
    }

    // save the user
    const user = await this.userRepository.save({ ...payload });

    // Save the user verification request
    await this.userVerificationRepository.save({ userId: user.id, verficationToken:uniqueString, expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000)  }); 

    // This is the email content being sent
    const html = `<p>Welcome to MoT</p><p>Verify your email address to complete the signup and login into your account.</p><p>The link will expire in 6 hours.</p><p>Press <a href=${
      currentUrl + "/v1/auth/verify/" + uniqueString
    }> here </a> to verify your email.</p>`;
    await this.transporterService.sendEmail({ html, subject: "Verify Your Email", to: payload.email });

    return user;
  }

  public async changePassword(user: User, payload: ChangePasswordRequest): Promise<boolean> {
    const encrytedOldPassword = this.encryptionService.encryptMD5(user.email + payload.oldPassword);
    if (encrytedOldPassword !== user.password) throw new Error("Old password is incorrect");

    const encryptedPassword = this.encryptionService.encryptMD5(user.email + payload.newPassword);
    if (encryptedPassword === encrytedOldPassword) throw new Error("New password must be different from old password");

    await this.userRepository.update({ id: user.id }, { password: encryptedPassword });

    // This is the email content being sent
    const html = "<p>Password has been Changed</p>";
    await this.transporterService.sendEmail({ html, subject: "Success!!", to: user.email });

    return true;
  }

  public async verify(token: string): Promise<boolean> {
    const userVerification = await this.userVerificationRepository.findOne({ where: { verficationToken: token } });
    if (!userVerification) throw new Error("Invalid token");

    const user = await this.userRepository.findOne({ where: { id: userVerification.userId } });
    if (!user) throw new Error("User not found");

    const isExpired = userVerification.expiresAt < new Date();
    if (isExpired) throw new Error("Token has expired");

    await this.userRepository.update({ id: user.id }, { isVerified: true });

    // This is the email content being sent
    const html = "<p>Email has been verified</p>";
    await this.transporterService.sendEmail({ html, subject: "Success!!", to: user.email });

    return true;
  }
}
