import { useState } from "react";
const crypto = require("crypto");

export function useEncrypt() {
    const encrypt = (message: string, key: string) => {
        const keyBuffer = Buffer.from(key, "base64");
        if (keyBuffer.length !== 32) {
            throw new Error("Key must be a 32-byte Base64-encoded string.");
        }
        const iv = crypto.randomBytes(12); // IV should remain as raw bytes
        const cipher = crypto.createCipheriv("aes-256-gcm", keyBuffer, iv);

        const encryptedBuffer = Buffer.concat([
            cipher.update(message, "utf8"),
            cipher.final(),
        ]);
        const tag = cipher.getAuthTag();
        return {
            ciphertext: encryptedBuffer.toString("base64"),
            iv: iv.toString("base64"),
            tag: tag.toString("base64"),
        };
    };

    const decryptSymmetric = (
        ciphertext: string,
        iv: string,
        tag: string,
        key: string
    ) => {
        const keyBuffer = Buffer.from(key, "base64");
        if (keyBuffer.length !== 32) {
            throw new Error("Key must be a 32-byte Base64-encoded string.");
        }

        const ivBuffer = Buffer.from(iv, "base64");
        const tagBuffer = Buffer.from(tag, "base64");

        const decipher = crypto.createDecipheriv("aes-256-gcm", keyBuffer, ivBuffer);
        decipher.setAuthTag(tagBuffer);

        let plaintext = decipher.update(ciphertext, "base64", "utf8");
        plaintext += decipher.final("utf8");

        return JSON.parse(plaintext);
    };

    return { encrypt, decryptSymmetric };
}
