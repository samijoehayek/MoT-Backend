import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { ItemRequest } from "../../dtos/request/item.request";
import { ItemResponse } from "../../dtos/response/item.response";
import { ITEM_REPOSITORY } from "../../repositories/item/item.repository";

@Service()
export class ItemService {
    @Inject(ITEM_REPOSITORY)
    protected itemRepository: ITEM_REPOSITORY;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async getItem(filter?: any): Promise<Array<ItemResponse>> {
        const item = filter ? await this.itemRepository.find(filter) : await this.itemRepository.find();
        if(!item) return [];
        return item;
    }

    public async createItem(payload: ItemRequest): Promise<ItemResponse> {
        if(payload.id) payload.id = String(payload.id).toLowerCase();
        return await this.itemRepository.save({...payload});
    }

    public async updateItem(id: string, payload: ItemRequest): Promise<ItemResponse> {
        const item = await this.itemRepository.findOne({ where: { id: id } });
        if (!item)
            throw new NotFound("Item not found");

        id = id.toLowerCase();
        await this.itemRepository.update({ id: id }, { ...payload });

        return item;
    }

    public async removeItem(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const item = await this.itemRepository.findOne({ where: { id: id } });
        if (!item)
            throw new NotFound("Item not found");

        await this.itemRepository.remove(item);
        return true;
    }
}
