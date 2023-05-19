import yargs from "yargs";
import * as Koa from "koa";

import {
  RedisStorage
} from "../relayer/storage/redis-storage";

import {
  Context,
  Environment,
  logging,
  LoggingContext,
  providers,
  RelayerApp,
  sourceTx,
  SourceTxContext,
  stagingArea,
  StagingAreaContext,
  StorageContext,
  TokenBridgeContext,
  tokenBridgeContracts,
  WalletContext,
  StandardRelayerApp,
  wallets,
  missedVaas
} from "@wormhole-foundation/relayer-engine";
import {
  CHAIN_ID_SOLANA,
  CHAIN_ID_ETH,
  CHAIN_ID_SUI,
  CHAIN_ID_POLYGON,
} from "@certusone/wormhole-sdk";
import { rootLogger } from "./log";
import { ApiController } from "./controller";
import { Logger } from "winston";

export type MyRelayerContext = LoggingContext &
  StorageContext &
  SourceTxContext &
  TokenBridgeContext &
  StagingAreaContext &
  WalletContext;


async function main() {

  let opts: any = yargs(process.argv.slice(2)).argv;

  const env = Environment.TESTNET;
  const app = new RelayerApp<MyRelayerContext>(env);
  const fundsCtrl = new ApiController();
  const namespace = "Matic2Algo-Relayer";
  // Config
  const store = new RedisStorage({
    attempts: 3,
    namespace,
    queueName: "relays",
  });
  configRelayer(app, store);
  
  app.use(fundsCtrl.processFundsTransfer); // <-- if you pass in a function with 3 args, it'll be used to process errors (whenever you throw from your middleware)
  app.use(missedVaas(app, { namespace: "Matic2Algo-Missed-VAA", logger: rootLogger }));
  app.use(logging(rootLogger)); // <-- logging middleware
  app.use(providers());
  
  //app.use(tokenBridgeContracts());
  app.use(stagingArea());
  app.use(sourceTx());

  app.listen();
  runUI(app, store, {port: 3001}, rootLogger);
}

function configRelayer<T extends Context>(
  app: RelayerApp<T>,
  store: RedisStorage
) {
  app.spy("localhost:7073");
  app.useStorage(store);
  app.logger(rootLogger);
}

function runUI(
  relayer: RelayerApp<any>,
  store: RedisStorage,
  { port }: any,
  logger: Logger
) {
  const app = new Koa();

  app.use(store.storageKoaUI("/ui"));
  app.use(async (ctx, next) => {
    if (ctx.request.method !== "GET" && ctx.request.url !== "/metrics") {
      await next();
      return;
    }

    ctx.body = await store.registry.metrics();
  });

  port = Number(port) || 3000;
  app.listen(port, () => {
    logger.info(`Running on ${port}...`);
    logger.info(`For the UI, open http://localhost:${port}/ui`);
    logger.info("Make sure Redis is running on port 6379 by default");
  });
}

main();
