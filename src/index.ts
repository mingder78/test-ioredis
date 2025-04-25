import { sleep, logger } from "./utils.ts";
import RedisClient from "./RedisClient.ts";

async function main(): Promise<void> {
  const redis = new RedisClient();
  await redis.connect();
  await redis.set("key1", { name: "John Doe" }, 1000);
    logger.log(await redis.get("key1"));
  await redis.set("key2", { name: "Ming Wang" });
  await redis.get("key1");
  sleep(2000).then(async () => {
    const deleted = await redis.delete("key2");
    if (deleted) {
    const ming = await redis.get("key2");
    logger.log(ming);
    };
    console.log("sleep done");
    await redis.disconnect();
  });
}

main().catch(logger.error);
// .finally(() => process.exit());
