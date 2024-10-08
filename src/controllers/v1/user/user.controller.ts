/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Inject } from "@tsed/di";
import { Post, Put, Returns, Tags } from "@tsed/schema";
import { UserResponse } from "../../../dtos/response/user.response";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { Get } from "@tsed/schema";
import { UserService } from "../../../app-services/user/user.service";
import { Arg, Authenticate } from "@tsed/passport";
import { Req } from "@tsed/common";
import { UserRequest } from "../../../dtos/request/user.request";
import { UserSessionResponse } from "../../../dtos/response/userSession.response";
// import { UserItemResponse } from "../../../dtos/response/userItem.response";

@Controller("/users")
@Tags("users")
export class UserController {
  @Inject(UserService)
  protected service: UserService;

  @Get("/")
  @Authenticate("admin-passport")
  @(Returns(200, Array).Of(UserResponse))
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

  // Get User Session
  @Get("/getUserSession")
  @Authenticate("jwt-passport")
  @Returns(200, UserSessionResponse)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getUserSession(@Arg(0) jwtPayload: any): Promise<UserSessionResponse> {
    try {
      return await this.service.getUserSession(jwtPayload);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/createUserSession")
  @Authenticate("jwt-passport")
  @Returns(200, UserSessionResponse)
  public async createUserSession(@Arg(0) jwtPayload: any): Promise<UserSessionResponse> {
    try {
      return await this.service.createUserSession(jwtPayload);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  // Ping Session
  @Put("/pingSession")
  @Authenticate("jwt-passport")
  @Returns(200, UserSessionResponse)
  public async pingSession(@Arg(0) jwtPayload: any): Promise<UserSessionResponse> {
    try {
      return await this.service.pingSession(jwtPayload);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  // Toggle Session Activity to True
  @Post("/sessionActivityTrue")
  @Authenticate("jwt-passport")
  @Returns(200, UserSessionResponse)
  public async sessionActivityTrue(@Arg(0) jwtPayload: any): Promise<UserSessionResponse> {
    try {
      return await this.service.sessionActivityTrue(jwtPayload);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  // Toggle Session Activity
  @Post("/sessionActivityFalse")
  @Authenticate("jwt-passport")
  @Returns(200, UserSessionResponse)
  public async sessionActivityFalse(@Arg(0) jwtPayload: any): Promise<UserSessionResponse> {
    try {
      return await this.service.sessionActivityFalse(jwtPayload);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }


  @Get("/searchUserByName")
  @Authenticate("admin-passport")
  @(Returns(200, Array).Of(UserResponse))
  public async searchUser(@QueryParams("search") search: string): Promise<UserResponse[]> {
    try {
      return await this.service.searchUserByName(search);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Put("/collectItem")
  @Authenticate("jwt-passport")
  @Returns(200, UserResponse)
  public async collectItem(
    @BodyParams() collectObject: { collectableId: string; userId: string },
    @Arg(0) jwtPayload: any
  ): Promise<UserResponse> {
    try {
      return await this.service.collectItem(collectObject.collectableId, collectObject.userId, jwtPayload);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/buyItem")
  @Authenticate("jwt-passport")
  @Returns(200, UserResponse)
  public async buyItem(@BodyParams() buyObject: { itemId: string; userId: string }, @Arg(0) jwtPayload: any): Promise<UserResponse> {
    try {
      return await this.service.buyItem(buyObject.itemId, buyObject.userId, jwtPayload);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/setUserWearable")
  @Authenticate("jwt-passport")
  @Returns(200, UserResponse)
  public async setUserWearable(
    @BodyParams() wearableObject: { itemId: string; userId: string },
    @Arg(0) jwtPayload: any
  ): Promise<UserResponse> {
    try {
      return await this.service.setUserWearable(wearableObject.itemId, wearableObject.userId, jwtPayload);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/removeUserWearable")
  @Authenticate("jwt-passport")
  @Returns(200, UserResponse)
  public async removeUserWearable(
    @BodyParams() wearableObject: { itemId: string; userId: string },
    @Arg(0) jwtPayload: any
  ): Promise<UserResponse> {
    try {
      return await this.service.removeUserWearable(wearableObject.itemId, wearableObject.userId, jwtPayload);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/setAvatarForUser/:userId/:avatarId")
  @Authenticate("jwt-passport")
  @Returns(200, UserResponse)
  public async setAvatarForUser(
    @PathParams("userId") userId: string,
    @PathParams("avatarId") avatarId: string,
    @Arg(0) jwtPayload: any
  ): Promise<UserResponse> {
    try {
      return await this.service.setAvatarForUser(userId, avatarId, jwtPayload);
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
  public async adminCreate(@BodyParams() user: UserRequest): Promise<UserResponse> {
    try {
      return await this.service.createUser(user);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/updateUserActivity/:userId/:activityStatus")
  @Authenticate("admin-passport")
  @Returns(200, Boolean)
  public async updateUserActivity(
    @PathParams("userId") userId: string,
    @PathParams("activityStatus") activityStatus: boolean
  ): Promise<boolean> {
    try {
      return await this.service.updateUserStatus(userId, activityStatus);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/updateUserTag/:userId")
  @Authenticate("admin-passport")
  @Returns(200, UserResponse)
  public async updateUser(@PathParams("userId") userId: string, @BodyParams() tag: { tag: string }): Promise<UserResponse> {
    try {
      return await this.service.updateUserTag(userId, tag.tag);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/updateUserBalance/:userId")
  @Authenticate("admin-passport")
  @Returns(200, UserResponse)
  public async updateUserBalance(@PathParams("userId") userId: string, @BodyParams() balance: { balance: number }): Promise<UserResponse> {
    try {
      return await this.service.updateUserBalance(userId, balance.balance);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/updateUserRole/:userId")
  @Authenticate("admin-passport")
  @Returns(200, UserResponse)
  public async updateUserRole(@PathParams("userId") userId: string, @BodyParams() role: { roleId: string }): Promise<UserResponse> {
    try {
      return await this.service.updateUserRole(userId, role.roleId);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/chatGpt/chatResponse")
  @Authenticate("jwt-passport")
  @Returns(200, String)
  public async chatGpt(@BodyParams() chatObject: { message: string }): Promise<string> {
    try {
      return await this.service.chatCompletions(chatObject.message);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/chatGpt/voiceResponse")
  @Authenticate("jwt-passport")
  @Returns(200, String)
  public async chatGptVoice(@BodyParams() audioObject: { audioBytes: number[] }): Promise<string> {
    try {
      return await this.service.chatCompletionsVoice(audioObject.audioBytes);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Put("/chatGpt/textToSpeech")
  @Authenticate("jwt-passport")
  @Returns(200, Buffer)
  public async chatGptTextToSpeech(@BodyParams() textToSpeechObject: { input: string, voice: string, speed: number }): Promise<Buffer> {
    try {
      return await this.service.chatTextToSpeech(textToSpeechObject.input, textToSpeechObject.speed, textToSpeechObject.voice);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }

  @Post("/create2FA")
  @Authenticate("jwt-passport")
  @Returns(200, UserResponse)
  public async create2FA(@Arg(0) jwtPayload: any): Promise<UserResponse> {
    try {   
      return await this.service.update2FA(jwtPayload);
    } catch (error) {
      throw new Exception(error.status, error.message);
    }
  }
  

}
