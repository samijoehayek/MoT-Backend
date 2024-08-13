import { Service } from "@tsed/di";
import { SessionJobService } from "../jobs/session.service";
import { SessionQueueService } from "../queues/session.service";

@Service()
export class UserSessionWorkerService {
  private queueService: SessionQueueService;
  private sessionJobService: SessionJobService;

  constructor(
    queueService: SessionQueueService,
    sessionJobService: SessionJobService,
  ) {
    this.queueService = queueService;
    this.sessionJobService = sessionJobService;

    this.initialize();
  }

  private initialize = async () => {
    this.queueService.sessionQueue.process("processUserSession", async () => {
      this.sessionJobService.processUserSession();
    });
  };
}
