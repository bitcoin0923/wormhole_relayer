import { Next } from "@wormhole-foundation/relayer-engine";
import { MyRelayerContext } from "./app";
import {  TokenTransfer, parseTokenTransferPayload } from "@certusone/wormhole-sdk";


export class ApiController {
  processFundsTransfer = async (ctx: MyRelayerContext, next: Next) => {
    
    let seq = ctx.vaa!.sequence.toString();
    //here is the part parsing payload
    let parsed = parseTokenTransferPayload(ctx.vaa.payload)
    ctx.logger.info(`chain middleware - ${seq} - ${ctx.sourceTxHash}`);
    //here is the filter part
    console.log(parsed);
    console.log(ctx.vaa);
    //this is not algorand account address but not public key (32byte)
    if(parsed.to.toString('hex') != "cea8c9cbdb373dac3d47b128f58921c16f9606ab0d4451739caea7d8ee8489e4"){ 
      return;
    }
    console.log({
      recipientAddress: parsed.to.toString('hex'),
      senderAddress: new TextDecoder().decode(parsed.tokenTransferPayload),
      tokenAddress: parsed.tokenAddress.toString('hex')
    });
    
    await ctx.kv.withKey(["counter"], async ({ counter }) => {
      ctx.logger.debug(`Original counter value ${counter}`);
      counter = (counter ? counter : 0) + 1;
      ctx.logger.debug(`Counter value after update ${counter}`);
      return {
        newKV: { counter },
        val: counter,
      };
    });
    await next();
  };
}
