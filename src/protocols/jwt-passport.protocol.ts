import { Req } from "@tsed/common";
import { Inject } from "@tsed/di";
import { Arg, OnVerify, Protocol } from "@tsed/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { envs } from "../config/envs";
import { USER_REPOSITORY } from "../repositories/user/user.repository";

@Protocol({
    name: "jwt-passport",
    useStrategy: Strategy,
    settings: {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: envs.JWT_KEY,
        issuer: envs.JWT_ISSUER,
        audience: envs.JWT_AUDIENCE
    }
})
export class JwtPassportProtocol implements OnVerify {
    @Inject(USER_REPOSITORY)
    userRepository: USER_REPOSITORY;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async $onVerify(@Req() req: Req, @Arg(0) jwtPayload: any) {
        const user = await this.userRepository.findOne({where: {id:jwtPayload.sub}});
        if (!user) throw new Error("Invalid token");

        return (req.user = { token: jwtPayload, user });
    }
}