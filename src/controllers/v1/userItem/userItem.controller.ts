import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { UserItemService } from "../../../app-services/userItem/userItem.service";
import { UserItemResponse } from "../../../dtos/response/userItem.response";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { UserItemRequest } from "../../../dtos/request/userItem.request";
import { Authenticate } from "@tsed/passport";

@Controller("/userItem")
@Tags("UserItem")
export class UserItemController{
    @Inject(UserItemService)            
    protected service: UserItemService;

    @Get("/")
    @Authenticate("admin-passport")
    @Returns(200, Array).Of(UserItemResponse)
    public async getUserItem(@QueryParams("filter") filter?: string): Promise<UserItemResponse[]> {
        try {
            return filter ? await this.service.getUserItem(JSON.parse(filter)) : await this.service.getUserItem();
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Post("/")
    @Authenticate("admin-passport")
    @Returns(200, UserItemResponse)
    public async createUserItem(@BodyParams() userItem: UserItemRequest): Promise<UserItemResponse> {
        try {
            return await this.service.createUserItem(userItem);
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Put("/:id")
    @Authenticate("admin-passport")
    @Returns(200, UserItemResponse)
    public async updateUserItem(@PathParams("id") id:string, @BodyParams() userItem: UserItemRequest): Promise<UserItemResponse> {
        try {
            return await this.service.updateUserItem(id, userItem);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Authenticate("admin-passport")
    @Returns(200, Boolean)
    public async deleteUserItem(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeUserItem(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}