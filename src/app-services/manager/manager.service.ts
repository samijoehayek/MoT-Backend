import { Inject, Service } from "@tsed/di";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";

@Service()
export class ManagerService {
  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  public async toggleUserLogIn(id: string, isActive: boolean): Promise<boolean> {
    id = id.toLowerCase();
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new Error("User not found");

    !isActive ? this.userRepository.update({ id: id }, { isActive: false }) : this.userRepository.update({ id: id }, { isActive: true });

    return true;
  }

}
