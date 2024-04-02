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
import { ROLE_REPOSITORY } from "../../repositories/role/role.repository";
import { USER_PASSWORD_VERIFICATION_REPOSITORY } from "../../repositories/userPasswordVerification/userPasswordVerification.repository";

@Service()
export class AuthService {
  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  @Inject(ROLE_REPOSITORY)
  protected roleRepository: ROLE_REPOSITORY;

  @Inject(USER_VERIFICATION_REPOSITORY)
  protected userVerificationRepository: USER_VERIFICATION_REPOSITORY;

  @Inject(USER_PASSWORD_VERIFICATION_REPOSITORY)
  protected userPasswordVerificationRepository: USER_PASSWORD_VERIFICATION_REPOSITORY;

  @Inject(EncryptionService)
  protected encryptionService: EncryptionService;

  @Inject(TransporterService)
  protected transporterService: TransporterService;

  public async signup(payload: UserRequest): Promise<UserResponse> {
    const currentUrl = "https://frontend-mt.com/verify-email?verificationString=";
    const uniqueString = uuidv4();

    // Check if user created email and password
    if (payload.email && payload.password) {
      payload.email = payload.email.toLowerCase();
      const encryptPassword = this.encryptionService.encryptMD5(payload.email + payload.password);
      payload.password = encryptPassword;
    }

    // If user did not choose a role, default to user
    if (!payload.roleId) {
      // Get the role id for normal user
      const role = await this.roleRepository.findOne({ where: { roleName: "user" } });
      payload.roleId = role?.id;
    } else {
      const roleObject = await this.roleRepository.findOne({ where: { id: payload.roleId } });
      // Check if the user chose a role of admin
      if (roleObject?.roleName.toLowerCase() === "admin") {
        console.log("Entered the conditional statement");
        throw new Error("You cannot create an admin account");
      }
    }

    // save the user
    const user = await this.userRepository.save({ ...payload, balance: 100 });

    // Save the user verification request
    await this.userVerificationRepository.save({
      userId: user.id,
      verficationToken: uniqueString,
      expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000)
    });

    // This is the email content being sent
    const html = `
    <div style="background-image: url('https://frontend-mt.com/images/webgl-loader.jpg'); background-size: cover; background-position: center; padding: 40px;">
      <h2 style="font-size: 24px; margin-top: 20px; color: white;">Saudi Tourism Metaverse</h2>
      <p style="font-size: 16px; margin-top: 20px; color: white;">Thank you for registering for the Saudi Tourism Metaverse.</p>
      <p style="font-size: 16px; color: white;">Click on the button below to verify your email.</p>
      <div style="margin-top: 30px;">
        <a href="${
          currentUrl + uniqueString
        }" style="display: inline-block; padding: 12px 24px; background-color: transparent; color: white; text-decoration: none; border-radius: 6px; border: 2px solid white; font-size: 16px;">Verify email</a>
      </div>
      <p style="font-size: 14px; margin-top: 20px; color: white;">The link will expire in 6 hours.</p>
    </div>
    <div style="background-color: #f5f5f5; padding: 20px;">
      <div style="text-align: center;">
        <img src="https://frontend-mt.com/images/logos/stc-logo.png" alt="Logo" style="max-width: 150px; margin: 0 auto;">
        <div style="margin-top: 20px;">
          <a href="https://www.linkedin.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/linkedin.svg" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
          <a href="https://www.twitter.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/x-platform.svg" alt="Twitter" style="width: 24px; height: 24px;"></a>
          <a href="https://www.instagram.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/instagram.svg" alt="Instagram" style="width: 24px; height: 24px;"></a>
          <a href="https://www.facebook.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/facbook.svg" alt="Facebook" style="width: 24px; height: 24px;"></a>
        </div>
        <p style="font-size: 12px; color: #999999; margin-top: 20px;">You are receiving this email because andrey@mimic.digital is registered for the Saudi Tourism Metaverse. This is a no-reply email.</p>
        <p style="font-size: 12px; color: #999999; margin-top: 10px;">For any queries, please contact live support on the Metaverse experience page <a href="mailto:support-metaverse@mt.gov.sa" style="color: #999999; text-decoration: none;">support-metaverse@mt.gov.sa</a></p>
      </div>
    </div>
  `;

    await this.transporterService.sendEmail({ html, subject: "Verify Your Email", to: payload.email });
    return user;
  }

  public async googleSignup(payload: UserRequest): Promise<UserResponse> {
    // If user did not choose a role, default to user
    if (!payload.roleId) {
      // Get the role id for normal user
      const role = await this.roleRepository.findOne({ where: { roleName: "user" } });
      payload.roleId = role?.id;
    } else {
      const roleObject = await this.roleRepository.findOne({ where: { id: payload.roleId } });
      // Check if the user chose a role of admin
      if (roleObject?.roleName.toLowerCase() === "admin") {
        console.log("Entered the conditional statement");
        throw new Error("You cannot create an admin account");
      }
    }
    // save the user
    const user = await this.userRepository.save({ ...payload, balance: 100, isVerified: true });

    return user;
  }

  public async userIsAdmin(user: UserResponse): Promise<boolean> {
    const role = await this.roleRepository.findOne({ where: { id: user.roleId } });
    if (!role?.roleName || role.roleName.toLowerCase() !== "admin") throw new Error("User is not Admin");
    return true;
  }

  public async resendVerificationEmail(userId: string): Promise<boolean> {
    const currentUrl = "https://frontend-mt.com/verify-email?verificationString=";
    const uniqueString = uuidv4();

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    // Save the user verification request
    await this.userVerificationRepository.update(
      { userId: userId },
      { verficationToken: uniqueString, expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000) }
    );

    // This is the email content being sent
    const html = `
    <div style="background-image: url('https://frontend-mt.com/images/webgl-loader.jpg'); background-size: cover; background-position: center; padding: 40px;">
      <h2 style="font-size: 24px; margin-top: 20px; color: white;">Saudi Tourism Metaverse</h2>
      <p style="font-size: 16px; margin-top: 20px; color: white;">Thank you for registering for the Saudi Tourism Metaverse.</p>
      <p style="font-size: 16px; color: white;">Click on the button below to verify your email.</p>
      <div style="margin-top: 30px;">
        <a href="${
          currentUrl + uniqueString
        }" style="display: inline-block; padding: 12px 24px; background-color: transparent; color: white; text-decoration: none; border-radius: 6px; border: 2px solid white; font-size: 16px;">Verify email</a>
      </div>
      <p style="font-size: 14px; margin-top: 20px; color: white;">The link will expire in 6 hours.</p>
    </div>
    <div style="background-color: #f5f5f5; padding: 20px;">
      <div style="text-align: center;">
        <img src="https://frontend-mt.com/images/logos/stc-logo.png" alt="Logo" style="max-width: 150px; margin: 0 auto;">
        <div style="margin-top: 20px;">
          <a href="https://www.linkedin.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/linkedin.svg" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
          <a href="https://www.twitter.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/x-platform.svg" alt="Twitter" style="width: 24px; height: 24px;"></a>
          <a href="https://www.instagram.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/instagram.svg" alt="Instagram" style="width: 24px; height: 24px;"></a>
          <a href="https://www.facebook.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/facbook.svg" alt="Facebook" style="width: 24px; height: 24px;"></a>
        </div>
        <p style="font-size: 12px; color: #999999; margin-top: 20px;">You are receiving this email because andrey@mimic.digital is registered for the Saudi Tourism Metaverse. This is a no-reply email.</p>
        <p style="font-size: 12px; color: #999999; margin-top: 10px;">For any queries, please contact live support on the Metaverse experience page <a href="mailto:support-metaverse@mt.gov.sa" style="color: #999999; text-decoration: none;">support-metaverse@mt.gov.sa</a></p>
      </div>
    </div>
  `;
    await this.transporterService.sendEmail({ html, subject: "Verify Your Email", to: user.email });

    return true;
  }

  public async changePassword(user: User, payload: ChangePasswordRequest): Promise<boolean> {
    const encrytedOldPassword = this.encryptionService.encryptMD5(user.email + payload.oldPassword);
    if (encrytedOldPassword !== user.password) throw new Error("Old password is incorrect");

    const encryptedPassword = this.encryptionService.encryptMD5(user.email + payload.newPassword);
    if (encryptedPassword === encrytedOldPassword) throw new Error("New password must be different from old password");

    await this.userRepository.update({ id: user.id }, { password: encryptedPassword });

    // This is the email content being sent
    const html = `
    <div style="background-image: url('https://frontend-mt.com/images/webgl-loader.jpg'); background-size: cover; background-position: center; padding: 40px;">
      <h2 style="font-size: 24px; margin-top: 20px; color: white;">Saudi Tourism Metaverse</h2>
      <p style="font-size: 16px; margin-top: 20px; color: white;">Your password has been successfully updated.</p>
    </div>
    <div style="background-color: #f5f5f5; padding: 20px;">
      <div style="text-align: center;">
        <img src="https://frontend-mt.com/images/logos/stc-logo.png" alt="Logo" style="max-width: 150px; margin: 0 auto;">
        <div style="margin-top: 20px;">
          <a href="https://www.linkedin.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/linkedin.svg" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
          <a href="https://www.twitter.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/x-platform.svg" alt="Twitter" style="width: 24px; height: 24px;"></a>
          <a href="https://www.instagram.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/instagram.svg" alt="Instagram" style="width: 24px; height: 24px;"></a>
          <a href="https://www.facebook.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/facbook.svg" alt="Facebook" style="width: 24px; height: 24px;"></a>
        </div>
        <p style="font-size: 12px; color: #999999; margin-top: 20px;">You are receiving this email because andrey@mimic.digital is registered for the Saudi Tourism Metaverse. This is a no-reply email.</p>
        <p style="font-size: 12px; color: #999999; margin-top: 10px;">For any queries, please contact live support on the Metaverse experience page <a href="mailto:support-metaverse@mt.gov.sa" style="color: #999999; text-decoration: none;">support-metaverse@mt.gov.sa</a></p>
      </div>
    </div>
  `;
    await this.transporterService.sendEmail({ html, subject: "Success!!", to: user.email });

    return true;
  }

  public async forgotPassword(token: string, newPassword: string): Promise<boolean> {
    const userPasswordVerification = await this.userPasswordVerificationRepository.findOne({ where: { verificationToken: token } });
    if (!userPasswordVerification) throw new Error("Invalid token");

    const user = await this.userRepository.findOne({ where: { id: userPasswordVerification.userId } });
    if (!user) throw new Error("User not found");

    const isExpired = userPasswordVerification.expiresAt < new Date();
    if (isExpired) throw new Error("Token has expired");

    if (!newPassword) throw new Error("New password is required");

    if (userPasswordVerification.passwordChanged) throw new Error("Password has already been changed, Create new request");

    const encryptedPassword = this.encryptionService.encryptMD5(user.email + newPassword);
    if (encryptedPassword === user.password) throw new Error("New password must be different from old password");

    await this.userRepository.update({ id: user.id }, { password: encryptedPassword });

    await this.userPasswordVerificationRepository.update({ id: userPasswordVerification.id }, { passwordChanged: true });

    // This is the email content being sent
    const html = `
    <div style="background-image: url('https://frontend-mt.com/images/webgl-loader.jpg'); background-size: cover; background-position: center; padding: 40px;">
      <h2 style="font-size: 24px; margin-top: 20px; color: white;">Saudi Tourism Metaverse</h2>
      <p style="font-size: 16px; margin-top: 20px; color: white;">Your password has been successfully updated.</p>
    </div>
    <div style="background-color: #f5f5f5; padding: 20px;">
      <div style="text-align: center;">
        <img src="https://frontend-mt.com/images/logos/stc-logo.png" alt="Logo" style="max-width: 150px; margin: 0 auto;">
        <div style="margin-top: 20px;">
          <a href="https://www.linkedin.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/linkedin.svg" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
          <a href="https://www.twitter.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/x-platform.svg" alt="Twitter" style="width: 24px; height: 24px;"></a>
          <a href="https://www.instagram.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/instagram.svg" alt="Instagram" style="width: 24px; height: 24px;"></a>
          <a href="https://www.facebook.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/facbook.svg" alt="Facebook" style="width: 24px; height: 24px;"></a>
        </div>
        <p style="font-size: 12px; color: #999999; margin-top: 20px;">You are receiving this email because andrey@mimic.digital is registered for the Saudi Tourism Metaverse. This is a no-reply email.</p>
        <p style="font-size: 12px; color: #999999; margin-top: 10px;">For any queries, please contact live support on the Metaverse experience page <a href="mailto:support-metaverse@mt.gov.sa" style="color: #999999; text-decoration: none;">support-metaverse@mt.gov.sa</a></p>
      </div>
    </div>
  `;
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

  public async forgotPasswordEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) throw new Error("Email does not exist");

    const currentUrl = "https://frontend-mt.com/forgot-password?userId=" + user.id + "&verificationString=";
    const uniqueString = uuidv4();

    // Save the user verification request
    await this.userPasswordVerificationRepository.save({
      userId: user.id,
      verificationToken: uniqueString,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000)
    });

    // This is the email content being sent
    const html = `
      <div style="background-image: url('https://frontend-mt.com/images/webgl-loader.jpg'); background-size: cover; background-position: center; padding: 40px;">
        <h2 style="font-size: 24px; margin-top: 20px; color: white;">Saudi Tourism Metaverse</h2>
        <p style="font-size: 16px; margin-top: 20px; color: white;">We have verified that its you!</p>
        <p style="font-size: 16px; color: white;">Click on the button below to reset your password.</p>
        <div style="margin-top: 30px;">
          <a href="${
            currentUrl + uniqueString
          }" style="display: inline-block; padding: 12px 24px; background-color: transparent; color: white; text-decoration: none; border-radius: 6px; border: 2px solid white; font-size: 16px;">Reset Password</a>
        </div>
        <p style="font-size: 14px; margin-top: 20px; color: white;">The link will expire in 6 hours.</p>
      </div>
      <div style="background-color: #f5f5f5; padding: 20px;">
        <div style="text-align: center;">
          <img src="https://frontend-mt.com/images/logos/stc-logo.png" alt="Logo" style="max-width: 150px; margin: 0 auto;">
          <div style="margin-top: 20px;">
            <a href="https://www.linkedin.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/linkedin.svg" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
            <a href="https://www.twitter.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/x-platform.svg" alt="Twitter" style="width: 24px; height: 24px;"></a>
            <a href="https://www.instagram.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/instagram.svg" alt="Instagram" style="width: 24px; height: 24px;"></a>
            <a href="https://www.facebook.com" target="_blank" style="display: inline-block; margin: 0 10px;"><img src="https://frontend-mt.com/images/logos/facbook.svg" alt="Facebook" style="width: 24px; height: 24px;"></a>
          </div>
          <p style="font-size: 12px; color: #999999; margin-top: 20px;">You are receiving this email because andrey@mimic.digital is registered for the Saudi Tourism Metaverse. This is a no-reply email.</p>
          <p style="font-size: 12px; color: #999999; margin-top: 10px;">For any queries, please contact live support on the Metaverse experience page <a href="mailto:support-metaverse@mt.gov.sa" style="color: #999999; text-decoration: none;">support-metaverse@mt.gov.sa</a></p>
        </div>
      </div>
    `;
    await this.transporterService.sendEmail({ html, subject: "Reset Password", to: email });

    return true;
  }
}
