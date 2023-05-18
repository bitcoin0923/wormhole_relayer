import { LoggingContext, SourceTxContext, StagingAreaContext, StorageContext, TokenBridgeContext, WalletContext } from "@wormhole-foundation/relayer-engine";
export type MyRelayerContext = LoggingContext & StorageContext & SourceTxContext & TokenBridgeContext & StagingAreaContext & WalletContext;
