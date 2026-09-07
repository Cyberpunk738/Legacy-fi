import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function runDemoRecording() {
  console.log("🎬 Starting LegacyFi Automated Demo Recorder...");

  const recordingsDir = path.resolve("./recordings");
  if (!fs.existsSync(recordingsDir)) {
    fs.mkdirSync(recordingsDir, { recursive: true });
  }

  // Launch browser with headless: false so the user can watch it run if they want, or headless if background
  const isHeadless = process.env.HEADLESS !== "false";
  console.log(`🌐 Launching Chromium (Headless: ${isHeadless})...`);

  const browser = await chromium.launch({
    headless: isHeadless,
    args: ["--window-size=1366,850"],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: recordingsDir,
      size: { width: 1280, height: 800 },
    },
  });

  const page = await context.newPage();

  console.log("🚀 Navigating to http://localhost:3000/?view=app...");
  await page.goto("http://localhost:3000/?view=app", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // 1. Initial Inspection of Status Cards
  console.log("📍 [1/6] Highlighting Sibyl Memory Status & Inheritance Cards...");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await page.waitForTimeout(2500);

  // 2. Select Agent Chat Tab
  console.log("📍 [2/6] Navigating to Agent Chat to input life-stage preference...");
  const agentTabButton = page.locator("button:has-text('Agent Chat')").first();
  if (await agentTabButton.isVisible()) {
    await agentTabButton.click();
    await page.waitForTimeout(1500);

    // Type brother education preference
    const chatInput = page.locator("input[placeholder*='brother'], input[placeholder*='message'], input[type='text']").last();
    if (await chatInput.isVisible()) {
      await chatInput.fill("My brother Marcus is studying computer science. Release his 30% gradually over 4 years for college tuition.");
      await page.waitForTimeout(1000);
      
      const sendBtn = page.locator("button:has-text('Send'), button:has(svg.lucide-send), button:has-text('Submit')").last();
      if (await sendBtn.isVisible()) {
        await sendBtn.click();
        await page.waitForTimeout(3000);
      }
    }

    // Click Fresh Session
    console.log("📍 [3/6] Starting Fresh Session to prove cross-session memory recall...");
    const freshSessionBtn = page.locator("button:has-text('Fresh Session')").first();
    if (await freshSessionBtn.isVisible()) {
      await freshSessionBtn.click();
      await page.waitForTimeout(2000);

      // Ask query after session reset
      const recallQueryInput = page.locator("input[placeholder*='message'], input[type='text']").last();
      if (await recallQueryInput.isVisible()) {
        await recallQueryInput.fill("What did I specify about my brother Marcus's inheritance?");
        await page.waitForTimeout(1000);
        const sendBtn2 = page.locator("button:has-text('Send'), button:has(svg.lucide-send), button:has-text('Submit')").last();
        if (await sendBtn2.isVisible()) {
          await sendBtn2.click();
          await page.waitForTimeout(3500);
        }
      }
    }
  }

  // 3. Navigate to Dashboard & Show Memory-Influenced Decision Card
  console.log("📍 [4/6] Inspecting Memory-Influenced Decision & A/B Contrast...");
  const studioTabButton = page.locator("button:has-text('Estate Studio'), button:has-text('Dashboard')").first();
  if (await studioTabButton.isVisible()) {
    await studioTabButton.click();
    await page.waitForTimeout(2000);

    // Scroll to Memory-Influenced Decision card
    await page.evaluate(() => window.scrollBy({ top: 350, behavior: "smooth" }));
    await page.waitForTimeout(2000);

    // Toggle Without Memory
    const withoutMemoryToggle = page.locator("button:has-text('Without Memory')").first();
    if (await withoutMemoryToggle.isVisible()) {
      await withoutMemoryToggle.click();
      await page.waitForTimeout(2500);
    }

    // Toggle With Sibyl Memory back
    const withMemoryToggle = page.locator("button:has-text('With Sibyl Memory')").first();
    if (await withMemoryToggle.isVisible()) {
      await withMemoryToggle.click();
      await page.waitForTimeout(2500);
    }
  }

  // 4. Smart Contract Deployment & Base Sepolia Interaction
  console.log("📍 [5/6] Demonstrating Real Base Sepolia Contract Deployment...");
  await page.evaluate(() => window.scrollBy({ top: 500, behavior: "smooth" }));
  await page.waitForTimeout(1500);

  const deployVaultBtn = page.locator("button:has-text('Deploy Dedicated Vault')").first();
  if (await deployVaultBtn.isVisible()) {
    await deployVaultBtn.click();
    await page.waitForTimeout(4000);
  }

  // 5. Navigate to Sibyl Memory Inspector
  console.log("📍 [6/6] Inspecting Sibyl Connectome Tiers & FTS5 Entities...");
  const inspectorTabButton = page.locator("button:has-text('Sibyl Inspector'), button:has-text('Connectome')").first();
  if (await inspectorTabButton.isVisible()) {
    await inspectorTabButton.click();
    await page.waitForTimeout(3000);
  }

  console.log("💾 Finalizing recording video...");
  await page.waitForTimeout(2000);

  // Close context to save video
  await page.close();
  await context.close();
  await browser.close();

  // Find the generated video file and rename it nicely
  const files = fs.readdirSync(recordingsDir).filter((f) => f.endsWith(".webm"));
  if (files.length > 0) {
    const latestFile = files.sort((a, b) => {
      return fs.statSync(path.join(recordingsDir, b)).mtimeMs - fs.statSync(path.join(recordingsDir, a)).mtimeMs;
    })[0];

    const targetName = `legacyfi-hackathon-demo-${Date.now()}.webm`;
    fs.renameSync(path.join(recordingsDir, latestFile), path.join(recordingsDir, targetName));
    console.log(`\n🎉 Recording Complete!`);
    console.log(`📹 Video saved to: recordings/${targetName}`);
  }
}

runDemoRecording().catch((err) => {
  console.error("❌ Recording script error:", err);
  process.exit(1);
});
