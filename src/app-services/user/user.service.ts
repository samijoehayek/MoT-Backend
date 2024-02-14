import { Inject, Service } from "@tsed/di";
import { UserResponse } from "../../dtos/response/user.response";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { UserRequest } from "../../dtos/request/user.request";
import { Conflict, NotAcceptable } from "@tsed/exceptions";
import { EncryptionService } from "../encryption/encryption.service";
import { AVATAR_REPOSITORY } from "../../repositories/avatar/avatar.repository";
import { USER_COLLECTABLE_REPOSITORY } from "../../repositories/userCollectable/userCollectable.repository";
import { COLLECTABLE_REPOSITORY } from "../../repositories/collectable/collectable.repository";

@Service()
export class UserService {
  @Inject(USER_REPOSITORY)
  protected repository: USER_REPOSITORY;

  @Inject(AVATAR_REPOSITORY)
  protected avatarRepository: AVATAR_REPOSITORY;

  @Inject(USER_COLLECTABLE_REPOSITORY)
  protected userCollectableRepository: USER_COLLECTABLE_REPOSITORY;

  @Inject(COLLECTABLE_REPOSITORY)
  protected collectableRepository: COLLECTABLE_REPOSITORY;

  @Inject(EncryptionService)
  protected encryptionService: EncryptionService;


  // Function to get all users from the database
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getUsers(filter?: any): Promise<Array<UserResponse>> {
    const users = filter ? await this.repository.find(filter) : await this.repository.find();
    if (!users) return [];
    return users;
  }

  // Function to get user by id from the database
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getUserById(id: string, filter?: any): Promise<UserResponse> {
    id = id.toLowerCase();
    const user = filter
      ? await this.repository.findOne({ where: { id: id }, ...filter })
      : await this.repository.findOne({ where: { id: id } });
    if (!user) return {} as UserResponse;
    return user;
  }

  // Function to collect item for user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async collectItem(collectableId: string, userId: string, jwtPayload:any): Promise<UserResponse> {
    userId = userId.toLowerCase();
    const user = await this.repository.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const user_Id = await this.repository.findOne({ where: { id: jwtPayload.sub } });
    if (userId != user_Id?.id) throw new Error("User not authorized to collect item for another user");

    const collectable = await this.collectableRepository.findOne({ where: { id: collectableId } });
    if (!collectable) throw new Error("Collectable not found");

    const userCollectable = await this.userCollectableRepository.findOne({ where: { collectableId: collectableId, userId:userId } });
    if (userCollectable) throw new Error("User collectable already exists, user cannot the item two times");

    // Add balance to user account with the value of the collectable
    user.balance = user.balance + collectable.value;

    // Add collectable to user collectable
    await this.userCollectableRepository.save({ collectableId: collectableId, userId: userId});

    // Save the user with the new balance
    await this.repository.save(user);
    return user;
  }


  // Function to set avatar for user
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async setAvatarForUser(userId: string, avatarId: string, jwtPayload:any): Promise<UserResponse> {
    userId = userId.toLowerCase();
    const user = await this.repository.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const user_Id = await this.repository.findOne({ where: { id: jwtPayload.sub } });
    if (userId != user_Id?.id) throw new Error("User not authorized to set avatar for another user");

    const avatarFound = user.avatarId ? true : false;
    if (avatarFound) throw new Error("User already has an avatar");

    const avatar = await this.avatarRepository.findOne({ where: { id: avatarId } });
    if (!avatar) throw new Error("Avatar not found");

    user.avatarId = avatarId;
    await this.repository.save(user);
    return user;
  }

  // Function to get number of users on platform
  public async getUserNumber(): Promise<string> {
    const count = await this.repository.count();
    if(!count) return "0";
    return count.toString();
  }

  // Function to create user and add to database
  public async createUser(payload: UserRequest): Promise<UserResponse> {
    if (!payload.email || !payload.password) throw new NotAcceptable("Email and password are required");

    // Validate email format using class-validator
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(payload.email)) {
        throw new NotAcceptable("Invalid email format");
    }

    const found = await this.repository.findOne({
      where: [{ email: payload.email?.toLowerCase() }, { username: payload.username }]
    });
    if (found) throw new Conflict("Email or username already exists");

    if (payload.email && payload.password) {
      payload.email = payload.email.toLowerCase();
      const encryptPassword = this.encryptionService.encryptMD5(payload.email + payload.password);
      payload.password = encryptPassword;
    }

    const newUser = await this.repository.save({ ...payload, isVerified:true });
    return newUser;
  }

  // Function to update user isActive status  
  public async updateUserStatus(userId: string, status: boolean): Promise<boolean> {

    const user = await this.repository.findOne({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    
    if (user.isActive === status) throw new Error("Status is already set to " + status);
    user.isActive = status;

    await this.repository.save(user);
    return true;
  }
}
