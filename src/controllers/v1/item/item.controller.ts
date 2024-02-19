import { Controller, Inject } from "@tsed/di";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { ItemService } from "../../../app-services/item/item.service";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Exception } from "@tsed/exceptions";
import { ItemResponse } from "../../../dtos/response/item.response";
import { ItemRequest } from "../../../dtos/request/item.request";
// import { UserItemRequest } from "../../../dtos/request/userItem.request";
import { Authenticate } from "@tsed/passport";

@Controller("/item")
@Tags("Item")
export class ItemController{
    @Inject(ItemService)            
    protected service: ItemService;

    @Get("/")
    @Returns(200, Array).Of(ItemResponse)
    public async getItem(@QueryParams("filter") filter?: string): Promise<ItemResponse[]> {
        try {
            return filter ? await this.service.getItem(JSON.parse(filter)) : await this.service.getItem();
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Post("/")
    @Authenticate("admin-passport")
    @Returns(200, ItemResponse)
    public async createItem(@BodyParams() item: ItemRequest): Promise<ItemResponse> {
        try {
            return await this.service.createItem(item);
        } catch (error) {
            throw new Exception(error.status, error.message);
        }
    }

    @Put("/:id")
    @Authenticate("admin-passport")
    @Returns(200, ItemResponse)
    public async updateItem(@PathParams("id") id:string, @BodyParams() item: ItemRequest): Promise<ItemResponse> {
        try {
            return await this.service.updateItem(id, item);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Authenticate("admin-passport")
    @Returns(200, Boolean)
    public async deleteItem(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeItem(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    // @Post("/collect")
    // @Returns(200, Boolean)
    // public async collectItem(@BodyParams() userItem: UserItemRequest): Promise<boolean> {
    //     try {
    //         return await this.service.collectItem(userItem);
    //     } catch (err) {
    //         throw new Exception(err.status, err.message);
    //     }
    // }

    // @Post("/drop")
    // @Returns(200, Boolean)
    // public async dropItem(@BodyParams() userItem: UserItemRequest): Promise<boolean> {
    //     try {
    //         return await this.service.dropItem(userItem);
    //     } catch (err) {
    //         throw new Exception(err.status, err.message);
    //     }
    // }



}