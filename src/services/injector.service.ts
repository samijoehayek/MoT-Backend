import { Inject, Service } from "@tsed/di";
import { SignupPassportProtocol } from "../protocols/signup-passport.protocol";
import { LoginPassportProtocol } from "../protocols/login-passport.passport";
import { JwtPassportProtocol } from "../protocols/jwt-passport.protocol";
import { ManagerPassportProtocol } from "../protocols/manager-passport.protocol";
import { AdminLoginPassportProtocol } from "../protocols/admin-login-passport.protocol";
import { AdminPassportProtocol } from "../protocols/admin-passport.protocol";

@Service()
export class InjectorService {
    @Inject(SignupPassportProtocol)
    public signupPassportProtocol: SignupPassportProtocol;
    
    @Inject(LoginPassportProtocol)
    public loginPassportProtocol: LoginPassportProtocol;

    @Inject(JwtPassportProtocol)
    public jwtPassportProtocol: JwtPassportProtocol;

    @Inject(ManagerPassportProtocol)
    public managerPassportProtocol: ManagerPassportProtocol;

    @Inject(AdminLoginPassportProtocol)
    public adminLoginPassportProtocol: AdminLoginPassportProtocol;

    @Inject(AdminPassportProtocol)
    public adminPassportProtocol: AdminPassportProtocol;
}