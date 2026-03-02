# Code Review Notes

## High-impact issues

1. **Currency formatter drops sign for negative amounts**
   - `fmt` always uses `Math.abs(n)`, so negative values are rendered as positive (`Rp 100.000` instead of `-Rp 100.000`).
   - This causes misleading UI in places that pass potentially-negative values to `fmt`, e.g. projected end-of-month assets (`estEndBal`).
   - References: `fmt` implementation and prediction card usage.

2. **Weak PIN hashing strategy (client-only, static salt, fast hash)**
   - PINs are hashed with plain SHA-256 + a hardcoded static prefix (`"dompetku_2025:" + pin`).
   - This is cheap to brute-force offline, especially for 4-digit PINs.
   - No per-user random salt, no key stretching (PBKDF2/Argon2/scrypt), and no attempt throttling/lockout in unlock flow.
   - References: `hashPin`, 4-digit PIN check in `PinScreen`.

3. **Biometric flow may be unreliable across browsers/devices**
   - Enrollment (`navigator.credentials.create`) does not persist credential IDs.
   - Verification (`navigator.credentials.get`) is called without `allowCredentials`, relying on discoverable credentials behavior which is not guaranteed in all environments.
   - Practical effect: biometric may appear enabled but fail unexpectedly on some devices.
   - References: `enableBiometrics`, `verifyBiometrics`.

## Medium issues

4. **Back-button history trap can bloat history stack**
   - On every `popstate`, the code immediately pushes another state. This can trap users and keep growing history entries.
   - Better approach: push one guard state once and handle exits without continuously re-pushing.
   - References: popstate `useEffect`.

5. **Import date parsing likely wrong for Excel serial dates**
   - Import uses `new Date(row[di])` directly.
   - Excel date serial numbers (common from `.xlsx`) are numeric day offsets and require conversion logic; direct `new Date(number)` interprets as Unix ms.
   - This can produce incorrect imported transaction dates.
   - References: import parser date handling.

## Suggested fixes (short)

- Replace `fmt` with sign-aware formatting helper (or keep `fmtAbs` and use explicit sign where needed).
- Upgrade PIN storage to PBKDF2/WebCrypto with per-user random salt + iteration count, and add unlock attempt throttling.
- Persist WebAuthn credential ID(s) after registration and use `allowCredentials` in verification.
- Rework back-button handling to avoid repeated `pushState` on each pop.
- Convert Excel serial dates explicitly during import (including 1900 epoch offset).
