import { Service } from "@tsed/di";
import { SessionService } from "../session.service";

@Service()
export class SessionJobService {
  private sessionService: SessionService;

  constructor(sessionService: SessionService) {
    this.sessionService = sessionService;
  }

  public async processUserSession() {
    this.sessionService.runCheckUserSession();
  }
}
