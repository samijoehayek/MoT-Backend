import { Inject, Service } from "@tsed/di";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";

@Service()
export class ManagerService {
  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  public async disableUser(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new Error("User not found");

    await this.userRepository.update({ id: id }, { isActive: false });

    return true;
  }
}
