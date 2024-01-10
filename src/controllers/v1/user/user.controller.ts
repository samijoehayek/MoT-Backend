import { Controller, Inject } from "@tsed/di";
import { Returns, Tags } from "@tsed/schema";
import { UserResponse } from "../../../dtos/response/user.response";
import { QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { Get } from "@tsed/schema";
import { UserService } from "../../../app-services/user/user.service";

@Controller("/users")
@Tags("users")
export class UserController {
  @Inject(UserService)
  protected service: UserService;

  @Get("/")
  @Returns(200, Array).Of(UserResponse)
  public async getAll(@QueryParams("filter") filter?:string): Promise<UserResponse[]> {
    try {
        return filter ? await this.service.getUsers(JSON.parse(filter)) : await this.service.getUsers();
    } catch (error) {
        throw new Exception(error.status, error.message);
    }
  }

}