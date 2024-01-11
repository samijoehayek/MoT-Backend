import { Controller, Inject } from "@tsed/di";
import { Post, Put, Returns, Tags } from "@tsed/schema";
import { AuthService } from "../../../app-services/auth/auth.service";
import { Authenticate } from "@tsed/passport";
import { AuthResponse } from "../../../dtos/response/auth.response";
import { BodyParams, Req, Res } from "@tsed/common";
import { Exception } from "@tsed/exceptions";
import { UserRequest } from "../../../dtos/request/user.request";
import { ChangePasswordRequest, LoginRequest } from "../../../dtos/request/auth.request";

@Controller("/auth")
@Tags("Auth")
export class AuthController {
    @Inject(AuthService)
    protected service: AuthService;

    @Post("/signup")
    @Authenticate("signup-passport")
    @Returns(200, AuthResponse)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    public async signup(@Req() req: any, @Res() res: any, @BodyParams() user: UserRequest): Promise<AuthResponse> {
        try {
        return res.send(req.user);
        } catch (error) {
        throw new Exception(error.status, error.message);
        }
    }

    @Post("/login")
    @Authenticate("login-passport")
    @Returns(200, AuthResponse)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    public async login(@Req() req: any, @Res() res: any, @BodyParams() user: LoginRequest): Promise<AuthResponse> {
        try {
        return res.send(req.user);
        } catch (error) {
        throw new Exception(error.status, error.message);
        }
    }

    @Put("/changePassword")
    @Authenticate("jwt-passport")
    @Returns(200, Boolean)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    public async changePassword(@Req() req: any, @BodyParams() payload: ChangePasswordRequest): Promise<Boolean> {
        try {
        return await this.service.changePassword(req.user.user, payload);
        } catch (error) {
        throw new Exception(error.status, error.message);
        }
    }

}
