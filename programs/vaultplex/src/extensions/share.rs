use anchor_lang::prelude::*;

/// Share extension
/// This is a first version for the MVP
/// The users will get 1 SPL token per each token deposited
/// There is also an instruction to create the Mint token account owned by the program too
#[derive(AnchorSerialize, AnchorDeserialize, Default, Clone, Debug)]
pub struct ShareExtension {
    // Indicates if the share system has been initialized
    pub is_initialized: bool,
    // Mint that represents the shares in the vault
    pub vault_token_mint: Pubkey,
}

impl ShareExtension {
    pub const SIZE: usize = 1 + 32; // is_initialized (1 byte) + vault_token_mint (32 bytes)

    // Initialize the share extension with the vault's token mint
    pub fn new(vault_token_mint: Pubkey) -> Self {
        Self {
            is_initialized: true,
            vault_token_mint,
        }
    }
}
