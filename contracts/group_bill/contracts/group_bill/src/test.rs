#![cfg(test)]
use super::*;
use soroban_sdk::{
    testutils::Address as _,
    token::{Client as TokenClient, StellarAssetClient},
    Address, Env, String, Vec,
};

fn create_token<'a>(env: &Env, admin: &Address) -> (TokenClient<'a>, StellarAssetClient<'a>) {
    let contract_address = env.register_stellar_asset_contract_v2(admin.clone());
    (
        TokenClient::new(env, &contract_address.address()),
        StellarAssetClient::new(env, &contract_address.address()),
    )
}

#[test]
fn test_create_bill() {
    let env = Env::default();
    env.mock_all_auths();

    // Register Treasury
    let treasury_id = env.register(treasury::TreasuryContract, ());
    let treasury_client = treasury::TreasuryContractClient::new(&env, &treasury_id);

    let contract_id = env.register(GroupBillContract, ());
    let client = GroupBillContractClient::new(&env, &contract_id);

    // Init contracts
    treasury_client.init(&contract_id);
    client.init(&treasury_id);

    let creator = Address::generate(&env);
    let participant = Address::generate(&env);
    let token = Address::generate(&env);

    let mut addrs: Vec<Address> = Vec::new(&env);
    addrs.push_back(participant.clone());

    let mut amounts: Vec<i128> = Vec::new(&env);
    amounts.push_back(10_000_000); // 1 XLM

    let bill_id = client.create_bill(
        &creator,
        &String::from_str(&env, "Dinner"),
        &token,
        &addrs,
        &amounts,
    );

    assert_eq!(bill_id, 1);
    let bill = client.get_bill(&bill_id);
    assert_eq!(bill.creator, creator);
    assert_eq!(bill.released, false);
    assert_eq!(bill.total_collected, 0);

    // Verify Treasury escrow state
    let escrow = treasury_client.get_escrow(&bill_id);
    assert_eq!(escrow.total, 10_000_000);
    assert_eq!(escrow.collected, 0);
}

#[test]
fn test_pay_and_release() {
    let env = Env::default();
    env.mock_all_auths();

    // Register Treasury
    let treasury_id = env.register(treasury::TreasuryContract, ());
    let treasury_client = treasury::TreasuryContractClient::new(&env, &treasury_id);

    let contract_id = env.register(GroupBillContract, ());
    let client = GroupBillContractClient::new(&env, &contract_id);

    treasury_client.init(&contract_id);
    client.init(&treasury_id);

    let admin = Address::generate(&env);
    let (token, token_admin) = create_token(&env, &admin);

    let creator = Address::generate(&env);
    let participant = Address::generate(&env);

    // Mint tokens to participant
    token_admin.mint(&participant, &10_000_000);

    let mut addrs: Vec<Address> = Vec::new(&env);
    addrs.push_back(participant.clone());
    let mut amounts: Vec<i128> = Vec::new(&env);
    amounts.push_back(10_000_000);

    let bill_id = client.create_bill(
        &creator,
        &String::from_str(&env, "Lunch"),
        &token.address,
        &addrs,
        &amounts,
    );

    client.pay_share(&bill_id, &participant, &token.address);

    let bill = client.get_bill(&bill_id);
    assert_eq!(bill.released, true);
    assert_eq!(bill.total_collected, 10_000_000);

    let escrow = treasury_client.get_escrow(&bill_id);
    assert_eq!(escrow.released, true);
    assert_eq!(escrow.collected, 10_000_000);

    // Creator should have received the funds from Treasury
    assert_eq!(token.balance(&creator), 10_000_000);
}

#[test]
fn test_bill_count() {
    let env = Env::default();
    env.mock_all_auths();

    let treasury_id = env.register(treasury::TreasuryContract, ());
    let treasury_client = treasury::TreasuryContractClient::new(&env, &treasury_id);

    let contract_id = env.register(GroupBillContract, ());
    let client = GroupBillContractClient::new(&env, &contract_id);
    
    treasury_client.init(&contract_id);
    client.init(&treasury_id);

    let creator = Address::generate(&env);
    let participant = Address::generate(&env);
    let token = Address::generate(&env);

    let mut addrs: Vec<Address> = Vec::new(&env);
    addrs.push_back(participant);
    let mut amounts: Vec<i128> = Vec::new(&env);
    amounts.push_back(5_000_000);

    client.create_bill(&creator, &String::from_str(&env, "A"), &token, &addrs, &amounts);
    client.create_bill(&creator, &String::from_str(&env, "B"), &token, &addrs, &amounts);

    assert_eq!(client.bill_count(), 2);
}
