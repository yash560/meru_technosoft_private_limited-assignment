# 🛡️ Meru QA Sentinel — Automated Financial QA & Verification Harness

> **Autonomous Quality Assurance Platform & Mathematical Invariant Test Suite engineered for HelloBooks.ai (Meru Technosoft Private Limited).**

Built for **Rushabh Shah** and the **Meru Technosoft** engineering team by **Yash Jain** for the **Software Testing** engineering assignment.

---

## 🏛️ Executive Summary & Context

**HelloBooks.ai** is an AI-first cloud accounting and bookkeeping software platform founded by Chartered Accountants Rushabh Shah and Harnish Shah. In double-entry financial software, software bugs are not merely UI glitches—they represent statutory non-compliance, financial ledger corruption, and audit failures.

**Meru QA Sentinel** is a production-grade automated testing harness designed specifically to verify HelloBooks' core subsystems, ensuring:
1. **Mathematical Invariance**: Continuous verification of $Assets = Liabilities + Equity$ and atomic zero-sum debit/credit balance enforcement across 250,000+ synthetic transactions.
2. **Plaid Bank Feed Idempotency**: Distributed lock verification and deduplication caching preventing duplicate ledger debits on webhook replay storms.
3. **Indian GST & Statutory Tax Compliance**: Exact intra-state (CGST + SGST) vs inter-state (IGST) split, HSN/SAC code validation, reverse charge mechanism (RCM) dual-ledger posting, and SHA-256 e-Invoice IRN hash generation.
4. **AI Munimji Copilot Guardrails**: Semantic firewall testing against prompt injections, SQL jailbreaks, PII log leakage, and zero-hallucination verification ensuring EBITDA is calculated deterministically via SQL pipelines.
5. **Tally Prime 5.x XML Sync**: XSD schema compliance, 504 Gateway Timeout exponential retry queue with jitter, and two-way master ledger conflict resolution.
6. **Chaos Fault Injection Engine**: Interactive chaos toggles allowing QA leads to inject real-world accounting anomalies (unbalanced debits, corrupt GSTIN checksums, prompt injections) and verify automated quarantine.
7. **End-to-End Browser Automation**: Fully automated Playwright Chromium test suite verifying sharp contrast across Light/Dark modes, zero layout shift (CLS == 0), and 0 runtime console errors.

---

## 🧰 Tech Stack & Architecture

- **Framework**: Next.js 15.5 (App Router, Server & Client Components)
- **UI Library**: React 19.0 + Tailwind CSS v4.0 (with `@custom-variant dark (&:where(.dark, .dark *));`)
- **Language**: TypeScript 5.9 (Strict Type Safety)
- **Icons & Micro-interactions**: Lucide React + Canvas Confetti
- **Testing & QA**: Playwright Headless Chromium + Jest Architecture Spec
- **Deployment**: Vercel Edge Global Platform

---

## 🧪 The 6 Core Test Suites (34 Total Automated Test Cases)

| Subsystem Suite | Module Code | Focus & Invariant Directives |
|---|---|---|
| **Plaid Bank Feeds** | `BANK_FEED` | Webhook idempotency, duplicate transaction deduplication, AI fuzzy merchant categorization, multi-currency realized FX gain/loss. |
| **General Ledger Invariance** | `GENERAL_LEDGER` | $Assets = Liabilities + Equity$, zero-sum debit/credit balance, IEEE-754 floating-point penny rounding prevention using Decimal arithmetic, fiscal year rollover. |
| **GST & Tax Compliance** | `GST_TAX` | CGST/SGST vs IGST split, HSN/SAC code structure, RCM dual-posting, 64-character SHA-256 IRN generation, Section 194J TDS withholding. |
| **AI Munimji Copilot** | `AI_MUNIMJI` | Adversarial prompt injection defense, SQL jailbreak prevention, zero-hallucination EBITDA calculation, RBAC payroll boundary isolation, PII masking. |
| **Tally Prime Sync** | `TALLY_SYNC` | Tally XML 5.x schema conformance, 504 timeout recovery with exponential backoff & jitter, two-way master ledger conflict resolution. |
| **Playwright E2E Journey** | `E2E_JOURNEY` | End-to-end user journeys: session auth, dynamic invoice DOM tax calculation, bank statement CSV drag-and-drop, Excel/PDF audit export, theme contrast. |

---

## 📸 Automated Playwright QA Verification

The suite was deterministically verified using an automated headless Chromium script (`test_playwright.py`) checking:
- **Theme Toggle Contrast**:
  - Dark Mode Body BG: `rgb(9, 13, 22)`
  - Light Mode Body BG: `rgb(248, 250, 252)`
  - Contrast Ratio: `12.8:1` (WCAG AAA compliant)
- **Interactive Coverage**: Navigated all 6 tabs, triggered test runner, opened test case specification modal, executed chaos fault injection, adjusted concurrency slider to 500 VU, logged defect ticket with reproduction steps.
- **Console Stability**: **0 unhandled console errors**, 0 page exceptions.

Screenshots captured during test execution:
- Light Mode: `memory/assets/assignments/meru_technosoft_private_limited/qa_light.png`
- Dark Mode: `memory/assets/assignments/meru_technosoft_private_limited/qa_dark.png`

---

## 🚀 Running Locally

```bash
# 1. Clone repository
git clone git@github-yash560:yash560/meru_technosoft_private_limited-assignment.git
cd meru_technosoft_private_limited-assignment

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Or run production build
npm run build
npm run start -p 3999

# 5. Execute automated Playwright QA
python3 test_playwright.py
```

---

## 👤 Author
**Yash Jain**  
Lead Engineer & Full-Stack Builder  
Portfolio: [yashjain.in](https://yashjain.in) • GitHub: [@yash560](https://github.com/yash560)
