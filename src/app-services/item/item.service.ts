import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { ItemRequest } from "../../dtos/request/item.request";
import { ItemResponse } from "../../dtos/response/item.response";
import { ITEM_REPOSITORY } from "../../repositories/item/item.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { USER_ITEM_REPOSITORY } from "../../repositories/userItem/userItem.repository";
import { AVATAR_REPOSITORY } from "../../repositories/avatar/avatar.repository";

@Service()
export class ItemService {
  @Inject(ITEM_REPOSITORY)
  protected itemRepository: ITEM_REPOSITORY;

  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  @Inject(AVATAR_REPOSITORY)
  protected avatarRepository: AVATAR_REPOSITORY;

  @Inject(USER_ITEM_REPOSITORY)
  protected userItemRepository: USER_ITEM_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getItem(filter?: any): Promise<Array<ItemResponse>> {
    const item = filter ? await this.itemRepository.find(filter) : await this.itemRepository.find();
    if (!item) return [];
    return item;
  }

  public async createItem(payload: ItemRequest): Promise<ItemResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();

    // check if the price is positive
    if (payload.price < 0) throw new NotFound("Price cannot be negative");

    // check if the avatar id exists
    const avatar = await this.avatarRepository.findOne({ where: { id: payload.avatarId } });
    if (!avatar) throw new NotFound("Avatar not found");

    // Make the type lowercase and see if it does match one of the 4 types
    payload.type = payload.type.toLowerCase();
    if (payload.type !== "head" && payload.type !== "torso" && payload.type !== "legs" && payload.type !== "feet") {
      throw new NotFound("Type not found");
    }

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
}
