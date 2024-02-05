import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { ItemRequest } from "../../dtos/request/item.request";
import { ItemResponse } from "../../dtos/response/item.response";
import { ITEM_REPOSITORY } from "../../repositories/item/item.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { OwnershipRequest } from "../../dtos/request/ownership.request";
import { OWNERSHIP_REPOSITORY } from "../../repositories/ownership/ownership.repository";

@Service()
export class ItemService {
  @Inject(ITEM_REPOSITORY)
  protected itemRepository: ITEM_REPOSITORY;

  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  @Inject(OWNERSHIP_REPOSITORY)
  protected ownershipRepository: OWNERSHIP_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getItem(filter?: any): Promise<Array<ItemResponse>> {
    const item = filter ? await this.itemRepository.find(filter) : await this.itemRepository.find();
    if (!item) return [];
    return item;
  }

  public async createItem(payload: ItemRequest): Promise<ItemResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();
    return await this.itemRepository.save({ ...payload });
  }

  public async updateItem(id: string, payload: ItemRequest): Promise<ItemResponse> {
    const item = await this.itemRepository.findOne({ where: { id: id } });
    if (!item) throw new NotFound("Item not found");

    id = id.toLowerCase();
    await this.itemRepository.update({ id: id }, { ...payload });

    return item;
  }

  public async removeItem(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const item = await this.itemRepository.findOne({ where: { id: id } });
    if (!item) throw new NotFound("Item not found");

    await this.itemRepository.remove(item);
    return true;
  }

  public async collectItem(payload: OwnershipRequest): Promise<boolean> {
    const item = await this.itemRepository.findOne({ where: { id: payload.itemId } });
    if (!item) throw new NotFound("Item not found");

    const user = await this.userRepository.findOne({ where: { id: payload.userId } });
    if (!user) throw new NotFound("User not found");

    const ownership = await this.ownershipRepository.findOne({ where: { userId: payload.userId, itemId: payload.itemId } });
    if (ownership) {
      await this.ownershipRepository.update(
        { userId: payload.userId, itemId: payload.itemId },
        { quantity: ownership.quantity + payload.quantity }
      );
    } else {
      await this.ownershipRepository.save({ userId: payload.userId, itemId: payload.itemId, quantity: payload.quantity });
    }

    return true;
  }

    public async dropItem(payload: OwnershipRequest): Promise<boolean> {
        const item = await this.itemRepository.findOne({ where: { id: payload.itemId } });
        if (!item) throw new NotFound("Item not found");
    
        const user = await this.userRepository.findOne({ where: { id: payload.userId } });
        if (!user) throw new NotFound("User not found");
    
        const ownership = await this.ownershipRepository.findOne({ where: { userId: payload.userId, itemId: payload.itemId } });
        if (!ownership) throw new NotFound("Ownership not found");
    
        if (ownership.quantity < payload.quantity) throw new NotFound("Insufficient quantity");
    
        await this.ownershipRepository.update(
        { userId: payload.userId, itemId: payload.itemId },
        { quantity: ownership.quantity - payload.quantity }
        );
    
        return true;
    }
}
