import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { ItemRequest } from "../../dtos/request/item.request";
import { ItemResponse } from "../../dtos/response/item.response";
import { ITEM_REPOSITORY } from "../../repositories/item/item.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { USER_ITEM_REPOSITORY } from "../../repositories/userItem/userItem.repository";
import { AVATAR_REPOSITORY } from "../../repositories/avatar/avatar.repository";
import { ILike } from "typeorm";

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

    // Make the type lowercase and see if it does match one of the 8 types
    payload.type = payload.type.toLowerCase();
    if (payload.type !== "head" && payload.type !== "torso" && payload.type !== "legs" && payload.type !== "feet" && payload.type !== "hands" && payload.type !== "ears" && payload.type !== "upperface" && payload.type !== "lowerface") {
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

  public async updateItemPrice(id:string, price:number): Promise<ItemResponse> {
    const item = await this.itemRepository.findOne({ where: { id: id } });
    if (!item) throw new NotFound("Item not found");

    if (item.price == price) throw new Error("Item price is already set to " + price);

    // Check if the value of the collectable is logical
    if (price < 0) throw new Error("Item price can't be negative");
    item.price = price;

    await this.itemRepository.update({ id: id }, { ...item });
    return item;
  }

  public async removeItem(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const item = await this.itemRepository.findOne({ where: { id: id } });
    if (!item) throw new NotFound("Item not found");

    await this.itemRepository.remove(item);
    return true;
  }

  public async searchItemByName(search: string): Promise<Array<ItemResponse>> {
    const item = await this.itemRepository.find({
      where: { itemName: ILike("%" + search + "%") }
    });
    if (!item) return [];
    return item;
  }
}
