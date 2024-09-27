import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { BN } from "bn.js";
import { randomBytes } from "crypto";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import {
  airdropSOL,
  initializeVault,
  initializeShareExtension,
  assertLockExtension,
  lockVault,
  depositSol,
  unlockVault,
  assertShareExtension,
} from "./helpers";
import { assert } from "chai";
import { Vaultplex } from "../target/types/vaultplex";

describe("vaultplex - Share Extension", () => {
  const user = Keypair.generate();
  const seed = new BN(randomBytes(8));

  const connection = anchor.getProvider().connection;
  const program = anchor.workspace.Vaultplex as anchor.Program<Vaultplex>;

  const vaultConfig = PublicKey.findProgramAddressSync(
    [Buffer.from("vault_config"), seed.toArrayLike(Buffer, "le", 8)],
    program.programId
  )[0];

  const vault = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), seed.toArrayLike(Buffer, "le", 8)],
    program.programId
  )[0];

  const vsharesMint = PublicKey.findProgramAddressSync(
    [Buffer.from("share_mint"), vaultConfig.toBuffer()],
    program.programId
  )[0];

  /* const vsharesAta = getAssociatedTokenAddressSync(
    vsharesMint,
    vaultConfig
  ); */

  // Derive the user's associated token account (ATA) for the given mint

  const mintAmount = new anchor.BN(1_000_000);

  it("should get some SOL for testing", async () => {
    await airdropSOL(user, 10); // 10 SOL
  });

  it("should initialize the vault with balance 0", async () => {
    await initializeVault(user, seed, vaultConfig);
  });

  it("should initialize the Share Extension", async () => {
    const vaultAccountData = await initializeShareExtension(user, vaultConfig, mintAmount);
    assertShareExtension(vaultAccountData, mintAmount);

    /* const vsharesAccount = await getAccount(
      connection,
      vsharesAta,
      "confirmed"
    );

    console.log(vsharesAccount) */
  });

  /* 

  it("should try to deposit while the vault is locked and catch the error", async () => {
    const amount = new BN(LAMPORTS_PER_SOL); // Deposit 1 SOL
    try {
        await depositSol(user, vaultConfig, vault, null, amount);

        assert.fail("Deposit should have failed because the vault is locked");
    } catch (err) {
      assert.include(err.toString(), "VaultLocked"); // Expect the VaultLocked error
    }
  });

  it("should unlock the vault and verify it's unlocked", async () => {
    const vaultAccountData = await unlockVault(user, vaultConfig);
    assertLockExtension(vaultAccountData, false);
  });

  it("should deposit some SOL while the vault is unlocked", async () => {
    const amount = new BN(LAMPORTS_PER_SOL); // Deposit 1 SOL
    
    await depositSol(user, vaultConfig, vault, null, amount);

    const balance = await connection.getBalance(vault);
    assert.equal(balance, LAMPORTS_PER_SOL);
  }); */
});
