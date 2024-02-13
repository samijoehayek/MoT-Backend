import { Inject, Service } from "@tsed/di";
import { OWNERSHIP_REPOSITORY } from "../../repositories/ownership/ownership.repository";
import { NotFound } from "@tsed/exceptions";
import { OwnershipRequest } from "../../dtos/request/ownership.request";
import { OwnershipResponse } from "../../dtos/response/ownership.response";

@Service()
export class OwnershipService {
    @Inject(OWNERSHIP_REPOSITORY)   
    protected ownershipRepository: OWNERSHIP_REPOSITORY;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async getOwnership(filter?: any): Promise<Array<OwnershipResponse>> {
        const ownership = filter ? await this.ownershipRepository.find(filter) : await this.ownershipRepository.find();
        return ownership;
    }

    public async createOwnership(payload: OwnershipRequest): Promise<OwnershipResponse> {
        return await this.ownershipRepository.save({ ...payload });
    }

    public async updateOwnership(id: string, payload: OwnershipRequest): Promise<OwnershipResponse> {
        const ownership = await this.ownershipRepository.findOne({ where: { id: id } });
        if (!ownership) throw new NotFound("Ownership not found");

        id = id.toLowerCase();
        await this.ownershipRepository.update({ id: id }, { ...payload });

        return ownership;
    }

    public async removeOwnership(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const ownership = await this.ownershipRepository.findOne({ where: { id: id } });
        if (!ownership) throw new NotFound("Ownership not found");

        await this.ownershipRepository.remove(ownership);
        return true;
    }
    
}