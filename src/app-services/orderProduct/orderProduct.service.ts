import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { OrderProductRequest } from "../../dtos/request/orderProduct.request";
import { OrderProductResponse } from "../../dtos/response/orderProduct.response";
import { ORDER_PRODUCT_REPOSITORY } from "../../repositories/orderProduct/orderProduct.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { OWNERSHIP_REPOSITORY } from "../../repositories/ownership/ownership.repository";

@Service()
export class OrderProductService {
  @Inject(ORDER_PRODUCT_REPOSITORY)
  protected orderProductRepository: ORDER_PRODUCT_REPOSITORY;

  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  @Inject(OWNERSHIP_REPOSITORY)
  protected ownershipRepository: OWNERSHIP_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getOrderProduct(filter?: any): Promise<Array<OrderProductResponse>> {
    const orderProduct = filter ? await this.orderProductRepository.find(filter) : await this.orderProductRepository.find();
    if (!orderProduct) return [];
    return orderProduct;
  }

  public async createOrderProduct(payload: OrderProductRequest): Promise<OrderProductResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();
    return await this.orderProductRepository.save({ ...payload });
  }

  public async updateOrderProduct(id: string, payload: OrderProductRequest): Promise<OrderProductResponse> {
    const orderProduct = await this.orderProductRepository.findOne({ where: { id: id } });
    if (!orderProduct) throw new NotFound("OrderProduct not found");

    id = id.toLowerCase();
    await this.orderProductRepository.update({ id: id }, { ...payload });

    return orderProduct;
  }

  public async removeOrderProduct(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const orderProduct = await this.orderProductRepository.findOne({ where: { id: id } });
    if (!orderProduct) throw new NotFound("OrderProduct not found");

    await this.orderProductRepository.remove(orderProduct);
    return true;
  }
}
