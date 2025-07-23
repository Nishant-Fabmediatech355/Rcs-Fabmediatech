import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

// Get the key from the .env file and ensure it's 32 bytes long
const secretKey = Buffer.from(process.env.encDecpSecete, "hex");

// Ensure the key length is 32 bytes (256 bits)
if (secretKey.length !== 32) {
  throw new Error("Secret key must be 32 bytes for AES-256-CBC.");
}

// Encryption function
const Encryption = (text) => {
  const iv = crypto.randomBytes(16); // 16-byte IV for AES CBC mode
  const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted; // Return IV and encrypted text
};

// Decryption function
const Decryption = (encryptedText) => {
  const [ivHex, encryptedData] = encryptedText.split(":");
  const ivBuffer = Buffer.from(ivHex, "hex");

  // Ensure the IV is 16 bytes long
  if (ivBuffer.length !== 16) {
    throw new Error("IV must be 16 bytes for AES-256-CBC.");
  }

  const decipher = crypto.createDecipheriv("aes-256-cbc", secretKey, ivBuffer);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export { Encryption, Decryption };
