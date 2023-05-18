"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const relayer_engine_1 = require("@wormhole-foundation/relayer-engine");
const wormhole_sdk_1 = require("@certusone/wormhole-sdk");
async function main() {
    const app = new relayer_engine_1.StandardRelayerApp(relayer_engine_1.Environment.TESTNET, {
        name: "Matic2Algo_Relayer",
    });
    app
        .chain(wormhole_sdk_1.CHAIN_ID_POLYGON)
        .address("0x377D55a7928c046E18eEbb61977e714d2a76472a", async (ctx, next) => {
        const vaa = ctx.vaa;
        const hash = ctx.sourceTxHash;
    });
    app.listen();
}
//# sourceMappingURL=app.js.map