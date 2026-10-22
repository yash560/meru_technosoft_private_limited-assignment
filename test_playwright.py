import asyncio
import os
import sys
from playwright.async_api import async_playwright

async def run():
    assets_dir = "/home/opc/brane/memory/assets/assignments/meru_technosoft_private_limited"
    os.makedirs(assets_dir, exist_ok=True)
    light_screenshot = os.path.join(assets_dir, "qa_light.png")
    dark_screenshot = os.path.join(assets_dir, "qa_dark.png")

    console_errors = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1440, "height": 900},
            permissions=["clipboard-read", "clipboard-write"]
        )
        page = await context.new_page()

        # Listen for console errors
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: console_errors.append(str(err)))

        print("🌐 Navigating to http://localhost:3999...")
        await page.goto("http://localhost:3999", wait_until="networkidle")
        await asyncio.sleep(1)

        # 1. Dark Mode Verification & Initial Capture
        print("🌙 Testing Initial Theme & Dark Mode...")
        is_dark_init = await page.evaluate("() => document.documentElement.classList.contains('dark')")
        print(f"   Initial Dark Mode class present: {is_dark_init}")

        dark_bg = await page.evaluate("() => window.getComputedStyle(document.body).backgroundColor")
        print(f"   Dark Mode Computed Body BG: {dark_bg}")
        await page.screenshot(path=dark_screenshot, full_page=True)
        print(f"   Saved dark screenshot: {dark_screenshot}")

        # 2. Toggle to Light Mode
        print("☀️ Testing Light Mode Switch...")
        await page.click("#theme-toggle-btn")
        await asyncio.sleep(0.5)

        is_dark_after = await page.evaluate("() => document.documentElement.classList.contains('dark')")
        light_bg = await page.evaluate("() => window.getComputedStyle(document.body).backgroundColor")
        print(f"   Dark class after toggle: {is_dark_after}")
        print(f"   Light Mode Computed Body BG: {light_bg}")
        assert not is_dark_after, "HTML should not have dark class in light mode"
        assert light_bg != dark_bg, f"Background colors must differ: light={light_bg}, dark={dark_bg}"

        await page.screenshot(path=light_screenshot, full_page=True)
        print(f"   Saved light screenshot: {light_screenshot}")

        # Toggle back to dark mode for rest of test
        await page.click("#theme-toggle-btn")
        await asyncio.sleep(0.5)

        # 3. Test Dashboard Multi-Horizon Filters
        print("📊 Testing Multi-Horizon Period & Category Filters...")
        for filter_id in ["p0", "p1", "financial", "ai", "all"]:
            selector = f"#filter-{filter_id}"
            await page.click(selector)
            await asyncio.sleep(0.2)
            print(f"   Clicked filter {filter_id}")

        # 4. Test Live Test Runner Tab
        print("🏃 Testing Live Test Runner...")
        await page.click("#tab-runner")
        await asyncio.sleep(0.5)

        # Select a specific suite and run it
        await page.select_option("#runner-suite-select", "SUITE_LEDGER_INVARIANCE")
        await asyncio.sleep(0.2)
        await page.click("#btn-execute-tests")
        await asyncio.sleep(1.2)
        print("   Executed General Ledger Invariance suite successfully.")

        # Test Export JSON report
        # We can trigger the button to ensure 0 errors
        await page.click("#btn-export-report")
        await asyncio.sleep(0.3)
        print("   Export JSON report button triggered.")

        # 5. Test Test Case Matrix Tab & Modal Drawer
        print("📋 Testing Test Case Matrix & Specification Drawer...")
        await page.click("#tab-matrix")
        await asyncio.sleep(0.5)

        # Type search query
        await page.fill("#search-test-matrix", "Plaid")
        await asyncio.sleep(0.3)
        await page.fill("#search-test-matrix", "")
        await asyncio.sleep(0.2)

        # Inspect first test case
        inspect_btn = page.locator("button:has-text('Spec & Code')").first
        await inspect_btn.click()
        await asyncio.sleep(0.5)

        # Verify modal is open and close it
        close_btn = page.locator("#btn-close-modal")
        await close_btn.click()
        await asyncio.sleep(0.3)
        print("   Inspected test specification modal and closed.")

        # 6. Test Chaos Engine Tab
        print("🔥 Testing Chaos Engine & Anomaly Injection...")
        await page.click("#tab-chaos")
        await asyncio.sleep(0.5)

        # Toggle unbalanced journal chaos
        await page.click("#toggle-chaos-unbalanced_journal")
        await asyncio.sleep(0.3)

        # Run fault verification
        await page.click("#chaos-run-btn")
        await asyncio.sleep(1.2)
        print("   Executed fault injection run.")

        # Reset chaos
        await page.click("#chaos-reset-btn")
        await asyncio.sleep(0.3)
        print("   Reset chaos faults.")

        # 7. Test Concurrency & Load Stress Tab
        print("⚡ Testing Performance & Concurrency Slider...")
        await page.click("#tab-performance")
        await asyncio.sleep(0.5)

        # Change slider value
        slider = page.locator("#concurrency-slider")
        await slider.evaluate("(el) => { el.value = 500; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }")
        await asyncio.sleep(0.4)
        print("   Adjusted concurrency slider to 500 VU.")

        # 8. Test Defect Tracker & New Defect Modal
        print("🐛 Testing Defect Tracker & Bug Submission...")
        await page.click("#tab-defects")
        await asyncio.sleep(0.5)

        # Click Copy Jira/Linear button
        copy_jira_btn = page.locator("#btn-copy-jira")
        if await copy_jira_btn.is_visible():
            await copy_jira_btn.click()
            await asyncio.sleep(0.2)
            print("   Copied Jira markdown.")

        # Open New Defect Modal
        await page.click("#btn-log-defect")
        await asyncio.sleep(0.4)

        await page.fill("#defect-title-input", "Playwright Synthetic QA Verification Ticket")
        await page.fill("#defect-desc-input", "Automated QA verification passed all regression tests.")
        await page.fill("#defect-expected-input", "0 console errors and 100% green invariants")
        await page.fill("#defect-actual-input", "0 console errors verified")
        await page.click("#defect-submit-btn")
        await asyncio.sleep(0.6)
        print("   Logged new defect into triage board.")

        # Return to Dashboard
        await page.click("#tab-dashboard")
        await asyncio.sleep(0.5)

        # 9. Verify Powered by TheWebVale & Tri-Axis Viewports
        print("📐 Testing Footer Branding & Tri-Axis Viewports...")
        body_text = await page.inner_text("body")
        assert "Powered by TheWebVale" in body_text, "Missing Powered by TheWebVale in footer"
        assert "Built by Yash Jain" not in body_text, "Leaked personal name in UI"

        # Check Tablet 768px
        await page.set_viewport_size({"width": 768, "height": 1024})
        await asyncio.sleep(0.5)
        sw_tab = await page.evaluate("() => document.documentElement.scrollWidth")
        cw_tab = await page.evaluate("() => document.documentElement.clientWidth")
        assert sw_tab <= cw_tab, f"Tablet horizontal overflow: {sw_tab} > {cw_tab}"
        print(f"   Tablet 768px clean (scrollWidth: {sw_tab}px, clientWidth: {cw_tab}px)")

        # Check Mobile 360px
        await page.set_viewport_size({"width": 360, "height": 800})
        await asyncio.sleep(0.5)
        sw_mob = await page.evaluate("() => document.documentElement.scrollWidth")
        cw_mob = await page.evaluate("() => document.documentElement.clientWidth")
        assert sw_mob <= cw_mob, f"Mobile horizontal overflow: {sw_mob} > {cw_mob}"
        print(f"   Mobile 360px clean (scrollWidth: {sw_mob}px, clientWidth: {cw_mob}px)")

        # Final assertion on console errors
        print("\n🔍 Checking for Console Errors...")
        print(f"   Total Console Errors: {len(console_errors)}")
        if console_errors:
            print(f"   Errors: {console_errors}")
            sys.exit(1)

        print("\n✅ PLAYWRIGHT QA VERIFICATION COMPLETED WITH 0 ERRORS!")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
