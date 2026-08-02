# Prospect demo guide

This walkthrough presents the strongest MineReady story in about five minutes. All names and records are fictional.

## Before the meeting

1. Open [https://mineready.zerodaycyber.io](https://mineready.zerodaycyber.io) on the device you will present.
2. Select **Reset demo** and confirm so the original 24-worker state and welcome are restored.
3. Confirm the release pill shows `v11.6.0`.
4. Confirm worker portraits appear and the browser console has no errors if developer tools are available.
5. Grant camera permission only if you intend to demonstrate live QR scanning; roster and photo lookup work without camera access.

## Five-minute flow

The first visit opens a concise welcome. Select **Start 3-minute tour** for a guided overview that moves through the real screens, or **Explore on my own** to begin the manual flow below. The tour can always be reopened with **Demo guide** in the demonstration banner.

### 1. Start with the operating picture

In **Mine Safety → Today**, point out the expected population, workers already clear, restricted workers, action-required exceptions, and workers currently on site. Explain that the view is designed around decisions before arrival instead of passive recordkeeping.

### 2. Find a worker without menu hopping

Open **People** and search for `Carlos Martinez`, `ZMR-1042`, or `WO-4821`. Explain that roster search understands the context operators commonly have: a name, badge ID, employer, role, crew, work order, or program.

### 3. Resolve the exception in context

Open Carlos at **Gate**. Select **Site orientation current**. The application explains why the worker is not clear and opens a prefilled site-hazard-awareness assignment with Carlos, the regulatory program, review owner, due date, and bilingual subjects already selected.

Cancel the form after explaining it unless the prospect wants to see the assignment recorded.

### 4. Contrast with a clear worker

Use Gate search for `Mei Chen`. Show the clear-for-assignment result and explain that approval is scoped to the demonstrated site, employer, role, crew, and work order.

### 5. Show employer intake

Switch to **Employer Admin → People → Add one worker**. Show the standard fields for worker ID, name, employer, role, crew, work order, primary program, and training language. Explain that new workers intentionally start with visible verification and training actions. CSV import remains available for larger rosters.

### 6. Optional worker experience

Switch to **Worker**, select Carlos, and change the language to **ES**. Show mobile training progress, acknowledgment, and the worker pass. Emphasize that completion moves to authorized review; the worker does not self-certify training.

## Close with the right message

MineReady demonstrates a simpler operational flow: identify the worker, understand the exact blocker, take the appropriate action in place, obtain authorized review, and make the gate decision with the assignment context visible.

Do not present the demo as an approved training curriculum, authoritative certification record, production identity platform, or live access-control system. Those capabilities require the controls described in [SECURITY.md](SECURITY.md) and [ARCHITECTURE.md](ARCHITECTURE.md).

## Recovery during a demo

- If prior interactions changed the data, use **Reset demo**.
- If camera access is unavailable, use photo decoding or roster lookup.
- If a QR scan is inconvenient, search by name, worker ID, or work order.
- If the page is cached, reload the live URL; release assets are versioned.
