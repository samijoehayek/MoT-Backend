import { Inject, Service } from "@tsed/di";
import { SignupPassportProtocol } from "../protocols/signup-passport.protocol";
import { LoginPassportProtocol } from "../protocols/login-passport.passport";
import { JwtPassportProtocol } from "../protocols/jwt-passport.protocol";
import { ModeratorPassportProtocol } from "../protocols/moderator-passport.protocol";
import { AdminLoginPassportProtocol } from "../protocols/admin-login-passport.protocol";
import { AdminPassportProtocol } from "../protocols/admin-passport.protocol";
import { OAuthPassportProtocol } from "../protocols/oauth-passport.protocol";
import { UserPassportProtocol } from "../protocols/user-passport.protocol";
import { UserSessionWorkerService } from "./workers/userSession.service";
import { SessionService } from "./session.service";

@Service()
export class InjectorService {
  // ------------ Inject Protocols ------------
  @Inject(SignupPassportProtocol)
  public signupPassportProtocol: SignupPassportProtocol;

  @Inject(LoginPassportProtocol)
  public loginPassportProtocol: LoginPassportProtocol;

  @Inject(JwtPassportProtocol)
  public jwtPassportProtocol: JwtPassportProtocol;

  @Inject(ModeratorPassportProtocol)
  public moderatorPassportProtocol: ModeratorPassportProtocol;

  @Inject(AdminLoginPassportProtocol)
  public adminLoginPassportProtocol: AdminLoginPassportProtocol;

  @Inject(AdminPassportProtocol)
  public adminPassportProtocol: AdminPassportProtocol;

  @Inject(OAuthPassportProtocol)
  public oAuthPassportProtocol: OAuthPassportProtocol;

  @Inject(UserPassportProtocol)
  public userPassportProtocol: UserPassportProtocol;

  // ------------ Inject Workers ------------
  @Inject(UserSessionWorkerService)
  public userSessionWorkerService: UserSessionWorkerService;

  // ------------ Inject Services ------------
  @Inject(SessionService)
  public sessionService: SessionService;
}
