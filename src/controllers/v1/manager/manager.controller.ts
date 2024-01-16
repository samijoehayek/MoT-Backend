import { Controller, Inject } from "@tsed/di";
import { Authenticate } from "@tsed/passport";
import { Put, Returns, Tags } from "@tsed/schema";
import { ManagerService } from "../../../app-services/manager/manager.service";
import { Exception } from "@tsed/exceptions";
import { PathParams } from "@tsed/platform-params";

@Controller("/manager")
@Tags("Manager")
export class ManagerController {
    @Inject(ManagerService)
    protected service: ManagerService;

    @Put("/toggleUserLogIn/:isActive/:id")
    @Authenticate("access-passport")
    @Returns(200, Boolean)
    public async toggleUserLogIn(@PathParams("id") id:string, @PathParams("isActive") isActive:boolean): Promise<boolean> {
        try {
            return await this.service.toggleUserLogIn(id, isActive);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }


    
}   