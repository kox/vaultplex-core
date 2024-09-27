import { PublicKey } from "@solana/web3.js";
import * as borsh from "borsh";

interface ShareExtensionFields {
  isInitialized: boolean;
  vaultTokenMint: PublicKey;
}

export class ShareExtension {
  isInitialized: boolean;
  vaultTokenMint: PublicKey;

  constructor(fields: ShareExtensionFields) {
    this.isInitialized = fields.isInitialized;
    this.vaultTokenMint = fields.vaultTokenMint; 
  }

  static fromBuffer(buffer: Buffer): ShareExtension {
    const decoded = borsh.deserialize(
      ShareExtensionSchema,
      buffer
    ) as ShareExtensionFields;

    return new ShareExtension(decoded);
  }

  static toBuffer(shareExtension: ShareExtension): Buffer {
    // Serialize the object to a buffer
    return Buffer.from(
      borsh.serialize(ShareExtensionSchema, {
        isInitialized: shareExtension.isInitialized,
        vaultTokenMint: shareExtension.vaultTokenMint,
      })
    );
  }
}

// Define the schema for ShareExtension using Borsh
const ShareExtensionSchema: borsh.Schema = {
  struct: {
    isInitialized: "u8",
    vaultTokenMint: { array: { type: "u8", len: 32 } },
  },
};
