import { faker } from "@faker-js/faker";
import Bull from "bull";
import Amodel from "../models/Amodel.js";
import db from "../config/db1.js";

// Configuration
const CONFIG = {
  TOTAL_RECORDS: 100000,
  BATCH_SIZE: 5000,
  PHONE_PREFIX: "91",
  QUEUE_NAME: "sms-queue",
  REDIS_CONFIG: {
    host: "0.0.0.0",
    port: 6379,
    enableReadyCheck: true,
    maxRetriesPerRequest: null,
  },
  PROGRESS_UPDATE_INTERVAL: 25000,
  QUEUE_TIMEOUT_MS: 15000,
  QUEUE_RETRY_LIMIT: 3,
};

// Robust Queue Initialization with retry
const initQueue = async (retry = 0) => {
  console.log(`⏳ Connecting to Redis Queue... (Attempt ${retry + 1})`);

  const queue = new Bull(CONFIG.QUEUE_NAME, {
    redis: CONFIG.REDIS_CONFIG,
    settings: {
      maxStalledCount: 0,
      retryProcessDelay: 5000,
    },
  });

  return new Promise((resolve, reject) => {
    let resolved = false;
    const timeout = setTimeout(() => {
      if (!resolved) {
        console.error("❌ Redis queue connection timeout");
        queue.close();
        if (retry < CONFIG.QUEUE_RETRY_LIMIT) {
          console.log("🔁 Retrying Redis Queue connection...");
          resolve(initQueue(retry + 1));
        } else {
          reject(new Error("Queue connection timeout"));
        }
      }
    }, CONFIG.QUEUE_TIMEOUT_MS);

    queue.on("ready", () => {
      clearTimeout(timeout);
      resolved = true;
      console.log("✅ Redis queue ready");
      resolve(queue);
    });

    queue.on("error", (err) => {
      clearTimeout(timeout);
      if (!resolved) {
        console.error("❌ Redis queue error:", err.message);
        reject(err);
      }
    });
  });
};

// Generate fake phone numbers
const generatePhone = () => `${CONFIG.PHONE_PREFIX}${faker.string.numeric(10)}`;

// Create test campaign
const createTestCampaign = async () => {
  const campaign = await Amodel.create({
    customer_id: 1,
    upload_file: "/dev/null",
    smsText: `Test message ${Date.now()}`,
    template_id: `TEST_${faker.string.alphanumeric(8)}`,
    time_to_send: new Date(),
    file_status: "processing",
  });

  if (!campaign || !campaign.id) {
    throw new Error("❌ Failed to create test campaign.");
  }

  return campaign;
};

// Main Test Execution
export const insertOneLakhTestRecords = async () => {
  const campaign = await createTestCampaign();
  const queue = await initQueue();
  let processed = 0;

  console.time("Total Processing Time");

  try {
    for (let i = 0; i < CONFIG.TOTAL_RECORDS; i += CONFIG.BATCH_SIZE) {
      const currentBatchSize = Math.min(
        CONFIG.BATCH_SIZE,
        CONFIG.TOTAL_RECORDS - i
      );

      const batch = Array.from({ length: currentBatchSize }, () => ({
        phone: generatePhone(),
        status: "pending",
        upload_id: campaign.smsupload_id,
        created_at: new Date(),
        updated_at: new Date(),
      }));

      await db.sequelize.transaction(async (transaction) => {
        await db.ProcessedNumbers.bulkCreate(batch, { transaction });

        await queue.addBulk(
          batch.map((record) => ({
            name: "send-sms",
            data: {
              phone: record.phone,
              campaignId: campaign.smsupload_id,
            },
            opts: {
              removeOnComplete: true,
              removeOnFail: 1000,
            },
          }))
        );
      });

      processed += currentBatchSize;

      if (processed % CONFIG.PROGRESS_UPDATE_INTERVAL === 0) {
        console.log(
          `📊 Progress: ${processed}/${CONFIG.TOTAL_RECORDS} records`
        );
      }
    }
  } catch (error) {
    console.error("❌ Processing Error:", error);
    throw error;
  } finally {
    await queue.close();
    console.timeEnd("Total Processing Time");
  }

  return { campaignId: campaign.smsupload_id };
};

// Verification
export const verifyTestData = async (campaignId) => {
  const queue = await initQueue();

  try {
    const [dbCount, jobCounts] = await Promise.all([
      db.ProcessedNumbers.count({ where: { upload_id: campaignId } }),
      queue.getJobCounts(),
    ]);

    console.log("✅ Verification Results:", {
      databaseRecords: dbCount,
      pendingJobs: jobCounts.waiting,
      activeJobs: jobCounts.active,
      completedJobs: jobCounts.completed,
    });

    return dbCount === CONFIG.TOTAL_RECORDS;
  } catch (err) {
    console.error("❌ Verification Error:", err);
    return false;
  } finally {
    await queue.close();
  }
};

// Optional: Standalone test
export const testQueueConnection = async () => {
  try {
    const queue = await initQueue();
    await queue.close();
    console.log("✅ Queue connection test passed");
  } catch (err) {
    console.error("❌ Queue connection test failed:", err.message);
    throw err;
  }
};
