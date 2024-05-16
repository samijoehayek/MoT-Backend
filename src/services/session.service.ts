import { Service } from "@tsed/di";
import { SessionQueueService } from "./queues/session.service";
import { UserService } from "../app-services/user/user.service";

@Service()
export class SessionService {
  private userSessionQueueService: SessionQueueService;
  private userService: UserService;

  constructor(userSessionQueueService: SessionQueueService, userService: UserService) {
    this.userService = userService;
    this.userSessionQueueService = userSessionQueueService;
    this.runCheckUserSession();
  }

  async runCheckUserSession() {
    await this.userService.checkUserSessions();
  }
}
