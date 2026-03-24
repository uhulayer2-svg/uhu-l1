use tokio::time::{interval, Duration};
use sled::Db;
use std::convert::TryInto;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;
use ax_extract = axum::extract;
use axum::{routing::{get, post}, Router, extract::{State, Json, Path}};
use tower_http::cors::CorsLayer;
use std::net::SocketAddr;
use serde::{Deserialize, Serialize};

#[derive(Clone)]
struct AppState { current_block: Arc<AtomicU64>, db: Db }

#[derive(Deserialize, Serialize, Clone)]
struct Transaction { from: String, to: String, amount: u64, block: u64 }

#[derive(Deserialize)]
struct TransferReq { to: String, amount: u64 }

#[derive(Serialize)]
struct TransferRes { success: bool, message: String }

#[tokio::main]
async fn main() {
    println!("===========================================");
    println!("👑 UHU-L1 MAINNET [LEDGER HISTORY ACTIVE]");
    println!("===========================================\n");

    let db: Db = sled::open("uhu-data").unwrap();
    let wallet_key = b"commander_wallet";
    if db.get(wallet_key).unwrap().is_none() {
        db.insert(wallet_key, &10_000_000_000_u64.to_be_bytes()).unwrap();
    }

    let saved_block = match db.get(b"last_block").unwrap() {
        Some(bytes) => u64::from_be_bytes(bytes.as_ref().try_into().unwrap()), None => 0,
    };

    let current_block = Arc::new(AtomicU64::new(saved_block));
    let current_block_clone = current_block.clone();
    let app_state = AppState { current_block: current_block.clone(), db: db.clone() };

    tokio::spawn(async move {
        let mut tick = interval(Duration::from_millis(10));
        let mut local_block = saved_block;
        loop {
            tick.tick().await;
            local_block += 1;
            current_block_clone.store(local_block, Ordering::Relaxed);
            if local_block % 100 == 0 {
                db.insert(b"last_block", &local_block.to_be_bytes()).unwrap();
                println!("🧱 Block {} confirmed.", local_block);
            }
        }
    });

    let app = Router::new()
        .route("/api/status", get(status_handler))
        .route("/api/transfer", post(transfer_handler))
        .route("/api/balance/:address", get(balance_handler))
        .route("/api/recent", get(recent_tx_handler)) // ✨ API ใหม่สำหรับดูประวัติ
        .with_state(app_state)
        .layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([0, 0, 0, 0], 3030));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// ✨ API ดึงประวัติ 10 รายการล่าสุด
async fn recent_tx_handler(State(state): State<AppState>) -> Json<Vec<Transaction>> {
    let mut txs = Vec::new();
    let tx_tree = state.db.open_tree(b"transactions").unwrap();
    for item in tx_tree.iter().rev().take(10) {
        if let Ok((_, v)) = item {
            if let Ok(tx) = serde_json::from_slice::<Transaction>(&v) { txs.push(tx); }
        }
    }
    Json(txs)
}

async fn balance_handler(State(state): State<AppState>, Path(address): Path<String>) -> String {
    let balance = match state.db.get(address.as_bytes()).unwrap() {
        Some(bytes) => u64::from_be_bytes(bytes.as_ref().try_into().unwrap()), None => 0,
    };
    format!(r#"{{"address": "{}", "balance": {}}}"#, address, balance)
}

async fn status_handler(State(state): State<AppState>) -> String {
    let block = state.current_block.load(Ordering::Relaxed);
    let balance = match state.db.get(b"commander_wallet").unwrap() {
        Some(bytes) => u64::from_be_bytes(bytes.as_ref().try_into().unwrap()), None => 0,
    };
    format!(r#"{{"block_height": {}, "treasury": {}}}"#, block, balance)
}

async fn transfer_handler(State(state): State<AppState>, Json(payload): Json<TransferReq>) -> Json<TransferRes> {
    let commander_key = b"commander_wallet";
    let block = state.current_block.load(Ordering::Relaxed);
    let mut commander_bal = match state.db.get(commander_key).unwrap() {
        Some(bytes) => u64::from_be_bytes(bytes.as_ref().try_into().unwrap()), None => 0,
    };

    if commander_bal >= payload.amount {
        commander_bal -= payload.amount;
        let mut receiver_bal = match state.db.get(payload.to.as_bytes()).unwrap() {
            Some(bytes) => u64::from_be_bytes(bytes.as_ref().try_into().unwrap()), None => 0,
        };
        receiver_bal += payload.amount;

        state.db.insert(commander_key, &commander_bal.to_be_bytes()).unwrap();
        state.db.insert(payload.to.as_bytes(), &receiver_bal.to_be_bytes()).unwrap();

        // 📝 บันทึกลง Ledger
        let tx = Transaction { from: "Commander".to_string(), to: payload.to.clone(), amount: payload.amount, block };
        let tx_tree = state.db.open_tree(b"transactions").unwrap();
        let tx_id = format!("{:010}", block);
        tx_tree.insert(tx_id.as_bytes(), serde_json::to_vec(&tx).unwrap()).unwrap();

        Json(TransferRes { success: true, message: format!("Sent {} UHU to {}", payload.amount, payload.to) })
    } else {
        Json(TransferRes { success: false, message: "Insufficient balance".to_string() })
    }
}
