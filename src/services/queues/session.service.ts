import { Service } from "@tsed/di";
import Bull, { Queue } from "bull";
import { _connectionOpts } from "../../config/ioredis";

@Service()
export class SessionQueueService {
  public sessionQueue: Queue;

  constructor() {
    console.log("Initializing user session queue...");
    this.sessionQueue = new Bull("sessionQueue", {
      redis: _connectionOpts,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000
        }
      }
    });

    this.sessionQueue.on("failed", (job, error) => {
      console.error(`Job ${job.name} - ${job.id} has failed with the following error: ${error.message}`);
    });

    this.sessionQueue.on("completed", (job) => job.remove());

    this.sessionQueue.add("processUserSession", {}, { repeat: { cron: "*/10 * * * *" } });
    console.log("User session queue initialized.");
  }
}
