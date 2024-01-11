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
        if(payload.id) payload.id = String(payload.id).toLowerCase();
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
