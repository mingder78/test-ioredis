import Redis from "ioredis";
import { sleep, logger } from "./utils.ts";

// Generic type T allows the class to work with any data type
class RedisClient<T = any> {
  private client: Redis | null;

  constructor(redisUrl: string = "redis://localhost:6379") {
    // Initialize ioredis client with URL
    this.client = new Redis(redisUrl, {
      // Optional: Configure reconnection
      enableAutoPipelining: true,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    // Set up error handling
    this.client.on("error", (err: Error) => {
      console.error("Redis Client Error:", err);
    });
  }

  async connect(): Promise<void> {
    console.log(typeof Redis);
    if (!this.client) {
      throw new Error("Redis client is not initialized");
    }
    try {
      // ioredis connects automatically, but ping ensures readiness
      await this.client.ping();
      console.log("Connected to Redis");
    } catch (err) {
      console.error("Redis Connection Error:", err);
      throw err;
    }
  }

  async set(key: string, value: T, ttl?: number): Promise<boolean> {
    if (!this.client) {
      throw new Error("Redis client is not initialized");
    }
    try {
      // Serialize value to JSON
      const serialized = JSON.stringify(value);
      if (ttl) {
        // Set with expiration (ttl in milliseconds, converted to seconds)
        await this.client.set(key, serialized, "PX", ttl);
      } else {
        await this.client.set(key, serialized);
      }
      console.log(`Set key "${key}"`);
      return true;
    } catch (err) {
      console.error("Set Key Error:", err);
      throw err;
    }
  }

  async get<K = T>(key: string): Promise<K | undefined> {
    if (!this.client) {
      throw new Error("Redis client is not initialized");
    }
    try {
      const value = await this.client.get(key);
      if (value === null) {
        console.log(`Key "${key}" not found`);
        return undefined;
      }
      // Deserialize JSON to typed value
      const deserialized = JSON.parse(value) as K;
      console.log(`Retrieved value for key "${key}":`, deserialized);
      return deserialized;
    } catch (err) {
      console.error("Get Key Error:", err);
      throw err;
    }
  }

  async delete(key: string): Promise<boolean> {
    if (!this.client) {
      throw new Error("Redis client is not initialized");
    }
    try {
      const result = await this.client.del(key);
      console.log(`Deleted key "${key}":`, result > 0);
      return result > 0;
    } catch (err) {
      console.error("Delete Key Error:", err);
      throw err;
    }
  }

  async clear(pattern: string = "*"): Promise<void> {
    if (!this.client) {
      throw new Error("Redis client is not initialized");
    }
    try {
      // Use KEYS to find matching keys and delete them
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        console.log(`Cleared ${keys.length} keys matching "${pattern}"`);
      } else {
        console.log("No keys to clear");
      }
    } catch (err) {
      console.error("Clear Keys Error:", err);
      throw err;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.client) {
      return;
    }
    try {
      await this.client.quit();
      console.log("Disconnected from Redis");
      this.client = null;
    } catch (err) {
      console.error("Disconnect Error:", err);
      throw err;
    }
  }

  get isConnected(): boolean {
    return this.client ? this.client.status === "ready" : false;
  }
}

export default RedisClient;
