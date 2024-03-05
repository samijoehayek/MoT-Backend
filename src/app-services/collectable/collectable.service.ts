import { Inject, Service } from "@tsed/di";
import { NotFound } from "@tsed/exceptions";
import { CollectableRequest } from "../../dtos/request/collectable.request";
import { CollectableResponse } from "../../dtos/response/collectable.response";
import { COLLECTABLE_REPOSITORY } from "../../repositories/collectable/collectable.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { ILike } from "typeorm";

@Service()
export class CollectableService {
  @Inject(COLLECTABLE_REPOSITORY)
  protected collectableRepository: COLLECTABLE_REPOSITORY;

  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getCollectable(filter?: any): Promise<Array<CollectableResponse>> {
    const collectable = filter ? await this.collectableRepository.find(filter) : await this.collectableRepository.find();
    if (!collectable) return [];
    return collectable;
  }

  public async createCollectable(payload: CollectableRequest): Promise<CollectableResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();
    return await this.collectableRepository.save({ ...payload });
  }

  public async updateCollectable(id: string, payload: CollectableRequest): Promise<CollectableResponse> {
    const collectable = await this.collectableRepository.findOne({ where: { id: id } });
    if (!collectable) throw new NotFound("Collectable not found");

    id = id.toLowerCase();
    await this.collectableRepository.update({ id: id }, { ...payload });

    return collectable;
  }

  public async updateCollectableName(id: string, collectableName: string): Promise<CollectableResponse> {
    const collectable = await this.collectableRepository.findOne({ where: { id: id } });
    if (!collectable) throw new NotFound("Collectable not found");

    if (collectable.name == collectableName) throw new Error("Collectable name is already set to " + collectableName);
    collectable.name = collectableName;

    await this.collectableRepository.update({ id: id }, { ...collectable });
    return collectable;
  }

  public async updateCollectableDescription(id: string, collectableDescription: string): Promise<CollectableResponse> {
    const collectable = await this.collectableRepository.findOne({ where: { id: id } });
    if (!collectable) throw new NotFound("Collectable not found");

    if (collectable.description == collectableDescription) throw new Error("Collectable descrption is already set to " + collectableDescription);
    collectable.description = collectableDescription;

    await this.collectableRepository.update({ id: id }, { ...collectable });
    return collectable;
  }

  public async updateCollectableValue(id: string, collectableValue: number): Promise<CollectableResponse> {
    const collectable = await this.collectableRepository.findOne({ where: { id: id } });
    if (!collectable) throw new NotFound("Collectable not found");

    if (collectable.value == collectableValue) throw new Error("Collectable value is already set to " + collectableValue);

    // Check if the value of the collectable is logical
    if (collectableValue < 0) throw new Error("Collectable value can't be negative");
    collectable.value = collectableValue;

    await this.collectableRepository.update({ id: id }, { ...collectable });
    return collectable;
  }

  public async removeCollectable(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const collectable = await this.collectableRepository.findOne({ where: { id: id } });
    if (!collectable) throw new NotFound("Collectable not found");

    await this.collectableRepository.remove(collectable);
    return true;
  }

  public async searchCollectableByName(search: string): Promise<Array<CollectableResponse>> {
    const collectable = await this.collectableRepository.find({
      where: { name: ILike("%" + search + "%") }
    });
    if (!collectable) return [];
    return collectable;
  }
}
