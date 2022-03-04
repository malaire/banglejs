use std::{
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc,
    },
    time::{Duration, SystemTime},
};

use bluer::{
    adv::{Advertisement, Type},
    Result, Session, Uuid,
};

// ======================================================================
// CONST

const SERVICE_UUID: Uuid = Uuid::from_u128(0x56A9BAE4_DE7E_490B_AEE3_C87326C10C66);

// ======================================================================
// FUNCTIONS

fn now_micros() -> u64 {
    SystemTime::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .unwrap_or(Duration::ZERO)
        .as_micros() as u64
}

// ======================================================================
// MAIN

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<()> {
    let session = Session::new().await?;
    let adapter = session.default_adapter().await?;
    adapter.set_powered(true).await?;

    println!(
        "Using Bluetooth adapter {} ({})",
        adapter.name(),
        adapter.address().await?
    );
    println!("Press Ctrl-C to quit.\n");

    let got_ctrl_c = Arc::new(AtomicBool::new(false));

    tokio::spawn({
        let got_ctrl_c = Arc::clone(&got_ctrl_c);
        async move {
            tokio::signal::ctrl_c()
                .await
                .expect("Failed to listen for Ctrl-C");
            println!("\nReceived SIGINT (Ctrl-C), quitting ...");
            got_ctrl_c.store(true, Ordering::SeqCst);
        }
    });

    let mut reference = now_micros();

    while !got_ctrl_c.load(Ordering::SeqCst) {
        let now: u64 = now_micros();

        let service_uuids = vec![SERVICE_UUID].into_iter().collect();
        let manufacturer_data = vec![(0xFFFF, now.to_be_bytes().to_vec())]
            .into_iter()
            .collect();

        let advertisement = Advertisement {
            // TODO
            // - I think `Type::Broadcast` would be better,
            //   but I havn't been able to get it working.
            advertisement_type: Type::Peripheral,
            service_uuids,
            manufacturer_data,
            ..Default::default()
        };

        let handle = adapter.advertise(advertisement).await?;
        tokio::time::sleep(Duration::from_millis(100)).await;
        drop(handle);

        let now = now_micros();
        while reference < now {
            reference += 1_000_000;
        }
        let delay = reference - now + fastrand::u64(0..=10_000);

        tokio::time::sleep(Duration::from_micros(delay)).await;
    }

    Ok(())
}
