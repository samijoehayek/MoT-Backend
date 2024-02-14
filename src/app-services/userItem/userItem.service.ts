import { Inject, Service } from "@tsed/di";
import { USER_ITEM_REPOSITORY } from "../../repositories/userItem/userItem.repository";
import { NotFound } from "@tsed/exceptions";
import { UserItemRequest } from "../../dtos/request/userItem.request";
import { UserItemResponse } from "../../dtos/response/userItem.response";

@Service()
export class UserItemService {
    @Inject(USER_ITEM_REPOSITORY)   
    protected userItemRepository: USER_ITEM_REPOSITORY;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async getUserItem(filter?: any): Promise<Array<UserItemResponse>> {
        const userItem = filter ? await this.userItemRepository.find(filter) : await this.userItemRepository.find();
        return userItem;
    }

    public async createUserItem(payload: UserItemRequest): Promise<UserItemResponse> {
        return await this.userItemRepository.save({ ...payload });
    }

    public async updateUserItem(id: string, payload: UserItemRequest): Promise<UserItemResponse> {
        const userItem = await this.userItemRepository.findOne({ where: { id: id } });
        if (!userItem) throw new NotFound("UserItem not found");

        id = id.toLowerCase();
        await this.userItemRepository.update({ id: id }, { ...payload });

        return userItem;
    }

    public async removeUserItem(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const userItem = await this.userItemRepository.findOne({ where: { id: id } });
        if (!userItem) throw new NotFound("UserItem not found");

        await this.userItemRepository.remove(userItem);
        return true;
    }
    
}