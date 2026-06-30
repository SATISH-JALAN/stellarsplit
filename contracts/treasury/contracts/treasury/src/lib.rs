#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, Symbol,
    token::Client as TokenClient,
};

mod test;

// ── Storage keys ──────────────────────────────────────────────────
const ESCROW: Symbol = symbol_short!("ESCROW");
const ADMIN:  Symbol = symbol_short!("ADMIN");

// ── Data types ────────────────────────────────────────────────────
#[contracttype]
#[derive(Clone)]
pub struct Escrow {
    pub bill_id:    u32,
    pub creator:    Address,
    pub token:      Address,
    pub total:      i128,
    pub collected:  i128,
    pub released:   bool,
}

// ── Events ────────────────────────────────────────────────────────
const DEPOSITED: Symbol = symbol_short!("T_DEP");
const RELEASED:  Symbol = symbol_short!("T_REL");

#[contract]
pub struct TreasuryContract;

#[contractimpl]
impl TreasuryContract {
    /// Initialize the treasury with an admin (the GroupBill contract address).
    pub fn init(env: Env, admin: Address) {
        env.storage().instance().set(&ADMIN, &admin);
    }

    /// Open an escrow slot for a bill.
    /// Called by the GroupBill contract (requires admin auth).
    pub fn open_escrow(
        env: Env,
        bill_id: u32,
        creator: Address,
        token: Address,
        total: i128,
    ) {
        let admin: Address = env.storage().instance().get(&ADMIN).expect("not initialized");
        admin.require_auth();

        let escrow = Escrow {
            bill_id,
            creator,
            token,
            total,
            collected: 0,
            released: false,
        };
        env.storage().instance().set(&bill_id, &escrow);
    }

    /// Deposit a payment into the escrow for a bill.
    /// Called by the GroupBill contract (admin). GroupBill collects from payer and then this function pulls from GroupBill.
    pub fn deposit(
        env: Env,
        bill_id: u32,
        payer: Address,
        amount: i128,
    ) {
        let admin: Address = env.storage().instance().get(&ADMIN).expect("not initialized");
        admin.require_auth();

        let mut escrow: Escrow = env
            .storage()
            .instance()
            .get(&bill_id)
            .expect("escrow not found");

        assert!(!escrow.released, "already released");
        assert!(amount > 0, "amount must be positive");

        // Note: GroupBill (admin) has already transferred the funds directly to this contract before calling this method.
        let token = TokenClient::new(&env, &escrow.token);

        escrow.collected += amount;
        env.events().publish((DEPOSITED, bill_id), (payer, amount));

        // Auto-release when fully funded
        if escrow.collected >= escrow.total {
            let creator = escrow.creator.clone();
            let total = escrow.collected;
            escrow.released = true;
            env.storage().instance().set(&bill_id, &escrow);

            token.transfer(&env.current_contract_address(), &creator, &total);
            env.events().publish((RELEASED, bill_id), (creator, total));
        } else {
            env.storage().instance().set(&bill_id, &escrow);
        }
    }

    /// Read escrow status.
    pub fn get_escrow(env: Env, bill_id: u32) -> Escrow {
        env.storage()
            .instance()
            .get(&bill_id)
            .expect("escrow not found")
    }
}
