import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { RoleService } from "../../../app-services/role/role.service";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { RoleResponse } from "../../../dtos/response/role.response";
import { RoleRequest } from "../../../dtos/request/role.request";

@Controller("/role")
@Tags("Role")
export class RoleController{
    @Inject(RoleService)
    protected service: RoleService;

    @Get("/")
    @Returns(200, Array).Of(RoleResponse)
    public async getRole(@QueryParams("filter") filter?: string): Promise<RoleResponse[]> {
        try {
            return filter ? await this.service.getRole(JSON.parse(filter)) : await this.service.getRole();
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Post("/")
    @Returns(200, RoleResponse)
    public async createRole(@BodyParams() role: RoleRequest): Promise<RoleResponse> {
        try {
            return await this.service.createRole(role);
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Put("/:id")
    @Returns(200, RoleResponse)
    public async updateRole(@PathParams("id") id:string, @BodyParams() role: RoleRequest): Promise<RoleResponse> {
        try {
            return await this.service.updateRole(id, role);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Returns(200, Boolean)
    public async deleteRole(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeRole(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

}