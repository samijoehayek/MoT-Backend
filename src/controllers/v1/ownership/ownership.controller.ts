import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { OwnershipService } from "../../../app-services/ownership/ownership.service";
import { OwnershipResponse } from "../../../dtos/response/ownership.response";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { OwnershipRequest } from "../../../dtos/request/ownership.request";
import { Authenticate } from "@tsed/passport";

@Controller("/ownership")
@Tags("Ownership")
export class OwnershipController{
    @Inject(OwnershipService)            
    protected service: OwnershipService;

    @Get("/")
    @Returns(200, Array).Of(OwnershipResponse)
    public async getOwnership(@QueryParams("filter") filter?: string): Promise<OwnershipResponse[]> {
        try {
            return filter ? await this.service.getOwnership(JSON.parse(filter)) : await this.service.getOwnership();
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Post("/")
    @Authenticate("admin-passport")
    @Returns(200, OwnershipResponse)
    public async createOwnership(@BodyParams() ownership: OwnershipRequest): Promise<OwnershipResponse> {
        try {
            return await this.service.createOwnership(ownership);
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Put("/:id")
    @Authenticate("admin-passport")
    @Returns(200, OwnershipResponse)
    public async updateOwnership(@PathParams("id") id:string, @BodyParams() ownership: OwnershipRequest): Promise<OwnershipResponse> {
        try {
            return await this.service.updateOwnership(id, ownership);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Authenticate("admin-passport")
    @Returns(200, Boolean)
    public async deleteOwnership(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeOwnership(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}