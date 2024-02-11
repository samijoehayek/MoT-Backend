import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { OrderRequest } from "../../dtos/request/order.request";
import { OrderResponse } from "../../dtos/response/order.response";
import { ORDER_REPOSITORY } from "../../repositories/order/order.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { OWNERSHIP_REPOSITORY } from "../../repositories/ownership/ownership.repository";

@Service()
export class OrderService {
  @Inject(ORDER_REPOSITORY)
  protected orderRepository: ORDER_REPOSITORY;

  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  @Inject(OWNERSHIP_REPOSITORY)
  protected ownershipRepository: OWNERSHIP_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getOrder(filter?: any): Promise<Array<OrderResponse>> {
    const order = filter ? await this.orderRepository.find(filter) : await this.orderRepository.find();
    if (!order) return [];
    return order;
  }

  public async createOrder(payload: OrderRequest): Promise<OrderResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();
    return await this.orderRepository.save({ ...payload });
  }

  public async updateOrder(id: string, payload: OrderRequest): Promise<OrderResponse> {
    const order = await this.orderRepository.findOne({ where: { id: id } });
    if (!order) throw new NotFound("Order not found");

    id = id.toLowerCase();
    await this.orderRepository.update({ id: id }, { ...payload });

    return order;
  }

  public async removeOrder(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const order = await this.orderRepository.findOne({ where: { id: id } });
    if (!order) throw new NotFound("Order not found");

    await this.orderRepository.remove(order);
    return true;
  }
  
}
