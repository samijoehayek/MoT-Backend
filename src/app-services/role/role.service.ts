import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { RoleRequest } from "../../dtos/request/role.request";
import { RoleResponse } from "../../dtos/response/role.response";
import { ROLE_REPOSITORY } from "../../repositories/role/role.repository";

@Service()
export class RoleService {
    @Inject(ROLE_REPOSITORY)
    protected roleRepository: ROLE_REPOSITORY;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async getRole(filter?: any): Promise<Array<RoleResponse>> {
        const role = filter ? await this.roleRepository.find(filter) : await this.roleRepository.find();
        if(!role) return [];
        console.log(JSON.parse('{"where":{"roleName":"Moderator"}}'));
        return role;
    }

    public async createRole(payload: RoleRequest): Promise<RoleResponse> {
        // Set role name to lowercase, this is done to avoid duplicate role names
        if(payload.roleName) payload.roleName = String(payload.roleName).toLowerCase();

        // Check if role with this name exists, if it does throw an error
        const role = await this.roleRepository.findOne({ where: { roleName: payload.roleName } });
        if (role)
            throw new NotFound("role with this name exists");

        // Set role id to lowercase
        if(payload.id) payload.id = String(payload.id).toLowerCase();

        // Return the role created 
        return await this.roleRepository.save({...payload});
    }

    public async updateRole(id: string, payload: RoleRequest): Promise<RoleResponse> {
        const role = await this.roleRepository.findOne({ where: { id: id } });
        if (!role)
            throw new NotFound("role not found");

        id = id.toLowerCase();
        await this.roleRepository.update({ id: id }, { ...payload });

        return role;
    }

    public async removeRole(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const role = await this.roleRepository.findOne({ where: { id: id } });
        if (!role)
            throw new NotFound("role not found");

        await this.roleRepository.remove(role);
        return true;
    }
}
