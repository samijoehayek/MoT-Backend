import { Controller, Inject } from "@tsed/di";
import { Authenticate } from "@tsed/passport";
import { Put, Returns, Tags } from "@tsed/schema";
import { ModeratorService } from "../../../app-services/moderator/moderator.service";
import { Exception } from "@tsed/exceptions";
import { PathParams } from "@tsed/platform-params";

@Controller("/moderator")
@Tags("Moderator")
export class ModeratorController {
    @Inject(ModeratorService)
    protected service: ModeratorService;

    @Put("/toggleUserLogIn/:isActive/:id")
    @Authenticate("moderator-passport")
    @Returns(200, Boolean)
    public async toggleUserLogIn(@PathParams("id") id:string, @PathParams("isActive") isActive:boolean): Promise<boolean> {
        try {
            return await this.service.toggleUserLogIn(id, isActive);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("/toggleUserMute/:isMuted/:id")
    @Authenticate("moderator-passport")
    @Returns(200, Boolean)
    public async toggleUserMute(@PathParams("id") id:string, @PathParams("isMuted") isMuted:boolean): Promise<boolean> {
        try {
            return await this.service.toggleUserMute(id, isMuted);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }



    
}   