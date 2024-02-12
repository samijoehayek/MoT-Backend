import { Inject, Service } from "@tsed/di";
import { UserResponse } from "../../dtos/response/user.response";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { UserRequest } from "../../dtos/request/user.request";
import { Conflict, NotAcceptable } from "@tsed/exceptions";
import { EncryptionService } from "../encryption/encryption.service";

@Service()
export class UserService {
  @Inject(USER_REPOSITORY)
  protected repository: USER_REPOSITORY;

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
}
