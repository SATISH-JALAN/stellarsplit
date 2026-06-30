#![cfg(test)]
use super::*;
use soroban_sdk::{
    testutils::Address as _,
    token::{Client as TokenClient, StellarAssetClient},
    Address, Env,
};

fn create_token<'a>(env: &Env, admin: &Address) -> (TokenClient<'a>, StellarAssetClient<'a>) {
    let ca = env.register_stellar_asset_contract_v2(admin.clone());
    (
        TokenClient::new(env, &ca.address()),
        StellarAssetClient::new(env, &ca.address()),
    )
}

#[test]
fn test_open_and_deposit_releases() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(TreasuryContract, ());
    let client = TreasuryContractClient::new(&env, &contract_id);

    let admin   = Address::generate(&env);
    let creator = Address::generate(&env);
    let payer   = Address::generate(&env);

    let (token, token_admin) = create_token(&env, &admin);
    token_admin.mint(&payer, &10_000_000);

    client.init(&admin);
    client.open_escrow(&1u32, &creator, &token.address, &10_000_000i128);
    client.deposit(&1u32, &payer, &10_000_000i128);

    let escrow = client.get_escrow(&1u32);
    assert!(escrow.released);
    assert_eq!(token.balance(&creator), 10_000_000);
}

#[test]
fn test_partial_deposit_not_released() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(TreasuryContract, ());
    let client = TreasuryContractClient::new(&env, &contract_id);

    let admin   = Address::generate(&env);
    let creator = Address::generate(&env);
    let payer   = Address::generate(&env);

    let (token, token_admin) = create_token(&env, &admin);
    token_admin.mint(&payer, &5_000_000);

    client.init(&admin);
    client.open_escrow(&2u32, &creator, &token.address, &10_000_000i128);
    client.deposit(&2u32, &payer, &5_000_000i128);

    let escrow = client.get_escrow(&2u32);
    assert!(!escrow.released);
    assert_eq!(escrow.collected, 5_000_000);
}
