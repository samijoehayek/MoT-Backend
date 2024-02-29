import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { UserCollectableService } from "../../../app-services/userCollectable/userCollectable.service";
import { UserCollectableResponse } from "../../../dtos/response/userCollectable.response";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { UserCollectableRequest } from "../../../dtos/request/userCollectable.request";
import { Authenticate } from "@tsed/passport";

@Controller("/userCollectable")
@Tags("UserCollectable")
export class UserCollectableController{
    @Inject(UserCollectableService)            
    protected service: UserCollectableService;

    @Get("/")
    @Authenticate("user-passport")
    @Returns(200, Array).Of(UserCollectableResponse)
    public async getUserCollectable(@QueryParams("filter") filter?: string): Promise<UserCollectableResponse[]> {
        try {
            return filter ? await this.service.getUserCollectable(JSON.parse(filter)) : await this.service.getUserCollectable();
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Post("/")
    @Authenticate("user-passport")
    @Returns(200, UserCollectableResponse)
    public async createUserCollectable(@BodyParams() userCollectable: UserCollectableRequest): Promise<UserCollectableResponse> {
        try {
            return await this.service.createUserCollectable(userCollectable);
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Put("/:id")
    @Authenticate("admin-passport")
    @Returns(200, UserCollectableResponse)
    public async updateUserCollectable(@PathParams("id") id:string, @BodyParams() userCollectable: UserCollectableRequest): Promise<UserCollectableResponse> {
        try {
            return await this.service.updateUserCollectable(id, userCollectable);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Authenticate("admin-passport")
    @Returns(200, Boolean)
    public async deleteUserCollectable(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeUserCollectable(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}