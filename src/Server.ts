import {join} from "path";
import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/ajv";
import "@tsed/swagger";
import {config} from "./config/index";
import * as v1 from "./controllers/v1/index";
import { InjectorService } from "./services/injector.service";
import * as pages from "./controllers/pages/index";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import methodOverride from "method-override";
import bodyParser from "body-parser";
import session from "express-session";

const rootDir = __dirname;
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [];


@Configuration({
  rootDir,
  allowedOrigins,
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  componentsScan: [
    `${rootDir}/repositories/*.ts`,
    `${rootDir}/app-services/*.ts`,
    `${rootDir}/services/*.ts`,
    `${rootDir}/protocols/*.ts`
  ],
  multer: {
    dest: `${rootDir}../../public`
  },
  statics: {
    "/": [
      {
        root: `./public`,
        hook: "$beforeRoutesInit"
      }
    ]
  },
  disableComponentsScan: true,
  ajv: {
    returnsCoercedValues: true
  },
  mount: {
    "/v1": [
      ...Object.values(v1)
    ],
    "/": [
      ...Object.values(pages)
    ]
  },
  swagger: [
    {
      path: "/doc",
      specVersion: "3.0.1"
    }
  ],
  middlewares: [
    cors({
      origin: [...allowedOrigins],
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "x-web3-auth-admin",
        "x-web3-auth-address",
        "x-web3-auth-msg",
        "x-web3-auth-signed",
        "x-web3-auth-chain",
        "x-web3-auth-isevm"
      ],
    }),
    cookieParser(),
    compress({}),
    methodOverride(),
    bodyParser.json(),
    bodyParser.urlencoded({
      extended: true,
    }),
  ],
  views: {
    root: join(process.cwd(), "../views"),
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: [
    "**/*.spec.ts"
  ]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  @Configuration()
  protected settings: Configuration;

  @Inject(InjectorService)
  protected injectorService: InjectorService;

  $beforeRoutesInit() {
    this.app
      .use(cookieParser())
      .use(methodOverride())
      .use(bodyParser.json({ limit: "2gb" }))
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(
        session({
          secret: "TickitBackendKey",
          resave: true,
          saveUninitialized: true,
          cookie: {
            path: "/",
            httpOnly: true,
            secure: false,
          }
        })
      )
  }
}
