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

    @Put("/disableUser/:id")
    @Authenticate("access-passport")
    @Returns(200, Boolean)
    public async disableUser(@PathParams("id") id:string): Promise<boolean> {
        try {
            return await this.service.disableUser(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }


    
}   