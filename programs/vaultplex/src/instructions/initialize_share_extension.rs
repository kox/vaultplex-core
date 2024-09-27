use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, Mint, TokenAccount, TokenInterface};

/* use anchor_spl::{
    associated_token::AssociatedToken, 
    token::{Mint, mint_to, MintTo, TokenAccount}, 
    token_interface::TokenInterface 
}; */

use crate::{VaultConfig, ShareExtension, SHARE_EXTENSION_OFFSET};

// Accounts context for initializing the Share extension
#[derive(Accounts)]
pub struct InitializeShareExtension<'info> {
    #[account(mut)]
    pub authority: Signer<'info>, // Vault creator or existing authority

    #[account(
        mut,
        has_one = authority,
    )]
    pub vault_config: Account<'info, VaultConfig>,

    #[account(
        init,
        payer = authority,
        seeds=[
            b"share_mint", 
            vault_config.key().as_ref()
        ],
        bump,
        mint::decimals = 9,
        mint::authority = vault_config,
        mint::freeze_authority = vault_config,
        mint::token_program = token_program,
    )]
    vshares_mint: InterfaceAccount<'info, Mint>,

    /*#[account(
        init,
        payer = authority,
        associated_token::token_program = token_program,
        associated_token::mint = mint,
        associated_token::authority = vault_config,
         associated_token::mint = vshares_mint,
        associated_token::authority = vault_config 
    )]
    pub vshares_token_account: InterfaceAccount<'info, TokenAccount>,*/

    pub system_program: Program<'info, System>,
    pub token_program: Interface<'info, TokenInterface>, // Token Interface (for both SPL and SPL2022)
    // pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> InitializeShareExtension<'info> {
    pub fn initialize_share_extension(&mut self, mint_amount: u64) -> Result<()> {
        let share_extension = ShareExtension::new(self.vshares_mint.key());

        // Write the Share extension to the vault's predefined slot for ShareExtension
        self.vault_config.write_extension(SHARE_EXTENSION_OFFSET, &share_extension)?;

        /* let inner_seeds = [
            WRAPPER_AUTH_SEED,
            ctx.accounts.deposit_mint.to_account_info().key.as_ref(),
            ctx.accounts.wrapped_mint.to_account_info().key.as_ref(),
            &[ctx.bumps.wrapper_authority],
        ]; */
    /* 
        // Mint some initial tokens
        let cpi_accounts = MintTo {
            mint: self.vshares_mint.to_account_info(),
            to: self.vshares_ata.to_account_info(),
            authority: self.vault_config.to_account_info(),
        };

        let cpi_program = self.token_program.to_account_info();

        let vault_config_binding = self.vault_config.seed.to_le_bytes();
        
        let seeds = &[
            b"vault_config", 
            vault_config_binding.as_ref(), 
            &[self.vault_config.vault_bump]
        ];
        
        
        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        // Mint initial tokens to ATA (amount can be adjusted)
        mint_to(cpi_ctx, mint_amount)?; */

        Ok(())
    }
}

