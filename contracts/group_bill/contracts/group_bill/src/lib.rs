#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, String, Symbol, Vec, IntoVal,
    token::Client as TokenClient,
};

mod test;

// ── Storage keys ──────────────────────────────────────────────────
const BILL: Symbol = symbol_short!("BILL");
const TREASURY: Symbol = symbol_short!("TREASURY");

// ── Data types ────────────────────────────────────────────────────
#[contracttype]
#[derive(Clone)]
pub struct Participant {
    pub address: Address,
    pub amount_due: i128,   // in stroops (1 XLM = 10_000_000)
    pub paid: bool,
}

#[contracttype]
#[derive(Clone)]
pub struct Bill {
    pub creator: Address,
    pub description: String,
    pub participants: Vec<Participant>,
    pub total_collected: i128,
    pub released: bool,
}

// ── Events ────────────────────────────────────────────────────────
const BILL_CREATED:  Symbol = symbol_short!("B_CREATED");
const PAYMENT_MADE:  Symbol = symbol_short!("B_PAID");
const FUNDS_RELEASED:Symbol = symbol_short!("B_RELEASE");

#[contract]
pub struct GroupBillContract;

#[contractimpl]
impl GroupBillContract {
    /// Initialize with the Treasury contract address.
    pub fn init(env: Env, treasury: Address) {
        env.storage().instance().set(&TREASURY, &treasury);
    }

    /// Create a new bill. Stores it in contract storage and opens escrow in Treasury.
    pub fn create_bill(
        env: Env,
        creator: Address,
        description: String,
        token: Address,
        participant_addresses: Vec<Address>,
        amounts_due: Vec<i128>,
    ) -> u32 {
        creator.require_auth();

        let len = participant_addresses.len();
        assert!(len == amounts_due.len(), "addresses/amounts length mismatch");
        assert!(len > 0, "at least one participant required");

        let mut total_due: i128 = 0;
        let mut participants: Vec<Participant> = Vec::new(&env);
        for i in 0..len {
            let amount = amounts_due.get(i).unwrap();
            total_due += amount;
            participants.push_back(Participant {
                address: participant_addresses.get(i).unwrap(),
                amount_due: amount,
                paid: false,
            });
        }

        // Use a simple incrementing bill ID stored in contract
        let bill_count: u32 = env.storage().instance().get(&BILL).unwrap_or(0);
        let bill_id = bill_count + 1;

        let bill = Bill {
            creator: creator.clone(),
            description: description.clone(),
            participants,
            total_collected: 0,
            released: false,
        };

        env.storage().instance().set(&bill_id, &bill);
        env.storage().instance().set(&BILL, &bill_id);

        // Open escrow in Treasury
        let treasury: Address = env.storage().instance().get(&TREASURY).expect("treasury not initialized");
        env.invoke_contract::<()>(
            &treasury,
            &Symbol::new(&env, "open_escrow"),
            (bill_id, creator.clone(), token, total_due).into_val(&env),
        );

        env.events().publish((BILL_CREATED, bill_id), (creator, description));

        bill_id
    }

    /// Pay your share. Caller must have approved token transfer.
    pub fn pay_share(
        env: Env,
        bill_id: u32,
        payer: Address,
        token: Address,
    ) {
        payer.require_auth();

        let mut bill: Bill = env
            .storage()
            .instance()
            .get(&bill_id)
            .expect("bill not found");

        assert!(!bill.released, "bill already released");

        // Find participant and mark paid
        let mut participants = bill.participants.clone();
        let mut amount_to_pay: i128 = 0;
        let mut found = false;

        for i in 0..participants.len() {
            let mut p = participants.get(i).unwrap();
            if p.address == payer {
                assert!(!p.paid, "already paid");
                amount_to_pay = p.amount_due;
                p.paid = true;
                participants.set(i, p);
                found = true;
                break;
            }
        }

        assert!(found, "payer is not a participant");
        assert!(amount_to_pay > 0, "amount due must be > 0");

        // Forward payment tracking to Treasury
        let treasury: Address = env.storage().instance().get(&TREASURY).expect("treasury not initialized");

        // Transfer tokens from payer directly to Treasury
        let token_client = TokenClient::new(&env, &token);
        token_client.transfer(
            &payer,
            &treasury,
            &amount_to_pay,
        );

        env.invoke_contract::<()>(
            &treasury,
            &Symbol::new(&env, "deposit"),
            (bill_id, payer.clone(), amount_to_pay).into_val(&env),
        );

        bill.participants = participants;
        bill.total_collected += amount_to_pay;

        // Check if all paid (sync released state with Treasury)
        let all_paid = bill.participants.iter().all(|p| p.paid);
        if all_paid {
            bill.released = true;
        }
        env.storage().instance().set(&bill_id, &bill);

        env.events().publish((PAYMENT_MADE, bill_id), (payer, amount_to_pay));
    }

    /// Read bill status (view function).
    pub fn get_bill(env: Env, bill_id: u32) -> Bill {
        env.storage()
            .instance()
            .get(&bill_id)
            .expect("bill not found")
    }

    /// Total number of bills created.
    pub fn bill_count(env: Env) -> u32 {
        env.storage().instance().get(&BILL).unwrap_or(0)
    }
}
