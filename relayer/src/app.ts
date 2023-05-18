import yargs from "yargs";
import * as Koa from "koa";
import {
  Context,
  Environment,
  logging,
  LoggingContext,
  missedVaas,
  providers,
  RelayerApp,
  sourceTx,
  SourceTxContext,
  stagingArea,
  StagingAreaContext,
  StandardRelayerApp,
  StorageContext,
  TokenBridgeContext,
  tokenBridgeContracts,
  WalletContext,
  wallets,
} from "@wormhole-foundation/relayer-engine";
import { CHAIN_ID_POLYGON, CHAIN_ID_SOLANA } from "@certusone/wormhole-sdk";
export type MyRelayerContext = LoggingContext &
  StorageContext &
  SourceTxContext &
  TokenBridgeContext &
  StagingAreaContext &
  WalletContext;

async function main() {
  const app = new StandardRelayerApp<MyRelayerContext>(Environment.TESTNET, {
    name: "Matic2Algo_Relayer",
  });

  app
    .chain(CHAIN_ID_POLYGON)
    .address(
      "0x377D55a7928c046E18eEbb61977e714d2a76472a",
      async (ctx: any, next: any) => {
        const vaa = ctx.vaa;
        const hash = ctx.sourceTxHash;
      },
    );

  app.listen();
}