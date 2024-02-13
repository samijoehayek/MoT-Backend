import { Controller, Inject } from "@tsed/di";
import { Post, Put, Returns, Tags } from "@tsed/schema";
import { UserResponse } from "../../../dtos/response/user.response";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { Get } from "@tsed/schema";
import { UserService } from "../../../app-services/user/user.service";
import { Authenticate } from "@tsed/passport";
import { Req } from "@tsed/common";
import { UserRequest } from "../../../dtos/request/user.request";

@Controller("/users")
@Tags("users")
export class UserController {
  @Inject(UserService)
  protected service: UserService;

  @Get("/")
  @Returns(200, Array).Of(UserResponse)
  public async getAll(@QueryParams("filter") filter?: string): Promise<UserResponse[]> {
    try {
      return filter ? await this.service.getUsers(JSON.parse(filter)) : await this.service.getUsers();
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Get("/getUserById")
  @Authenticate("jwt-passport")
  @Returns(200, UserResponse)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getUserById(@Req() req: any, @QueryParams("filter") filter?: string): Promise<UserResponse> {
    try {
      return filter
        ? await this.service.getUserById(req.user.user.id, JSON.parse(filter))
        : await this.service.getUserById(req.user.user.id);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Get("/getUserCount")
  @Authenticate("admin-passport")
  @Returns(200, String)
  public async getUserCount(): Promise<string> {
    try {
      return await this.service.getUserNumber();
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/adminCreate")
  @Authenticate("admin-passport")
  @Returns(200, UserResponse)
  public async adminCreate(@BodyParams() user:UserRequest): Promise<UserResponse>{
    try {
      return await this.service.createUser(user);
    } catch (error) {
      throw new Exception(error.status, error.message)
    }

  }

  @Put("/updateUserActivity/:userId/:activityStatus")
  @Authenticate("admin-passport")
  @Returns(200, Boolean)
  public async updateUserActivity(@PathParams("userId") userId:string, @PathParams("activityStatus") activityStatus:boolean): Promise<boolean>{
    try {
      return await this.service.updateUserStatus(userId, activityStatus);
    } catch (error) {
      throw new Exception(error.status, error.message)
    }

  }
}
