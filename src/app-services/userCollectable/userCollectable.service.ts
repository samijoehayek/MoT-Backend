import { Inject, Service } from "@tsed/di";
import { USER_COLLECTABLE_REPOSITORY } from "../../repositories/userCollectable/userCollectable.repository";
import { NotFound } from "@tsed/exceptions";
import { UserCollectableRequest } from "../../dtos/request/userCollectable.request";
import { UserCollectableResponse } from "../../dtos/response/userCollectable.response";

@Service()
export class UserCollectableService {
    @Inject(USER_COLLECTABLE_REPOSITORY)   
    protected userCollectableRepository: USER_COLLECTABLE_REPOSITORY;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async getUserCollectable(filter?: any): Promise<Array<UserCollectableResponse>> {
        const userCollectable = filter ? await this.userCollectableRepository.find(filter) : await this.userCollectableRepository.find();
        return userCollectable;
    }

    public async createUserCollectable(payload: UserCollectableRequest): Promise<UserCollectableResponse> {
        return await this.userCollectableRepository.save({ ...payload });
    }

    public async updateUserCollectable(id: string, payload: UserCollectableRequest): Promise<UserCollectableResponse> {
        const userCollectable = await this.userCollectableRepository.findOne({ where: { id: id } });
        if (!userCollectable) throw new NotFound("UserCollectable not found");

        id = id.toLowerCase();
        await this.userCollectableRepository.update({ id: id }, { ...payload });

        return userCollectable;
    }

    public async removeUserCollectable(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const userCollectable = await this.userCollectableRepository.findOne({ where: { id: id } });
        if (!userCollectable) throw new NotFound("UserCollectable not found");

        await this.userCollectableRepository.remove(userCollectable);
        return true;
    }
    
}