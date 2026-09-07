import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function runDemoRecording() {
  console.log("🎬 Starting LegacyFi Presentation-Grade Demo Recorder for Hackathon Judges...");

  const recordingsDir = path.resolve("./recordings");
  if (!fs.existsSync(recordingsDir)) {
    fs.mkdirSync(recordingsDir, { recursive: true });
  }

  const isHeadless = process.env.HEADLESS !== "false";
  console.log(`🌐 Launching Chromium (Headless: ${isHeadless})...`);

  const browser = await chromium.launch({
    headless: isHeadless,
    args: [
      "--window-size=1440,900",
      "--disable-infobars",
      "--force-device-scale-factor=1",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: recordingsDir,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();

  // Helper to inject judge presentation banner and animated cursor
  const injectJudgeOverlay = async () => {
    await page.evaluate(() => {
      // Remove any existing overlay
      const old = document.getElementById("judge-overlay-banner");
      if (old) old.remove();

      // Create judge banner overlay
      const banner = document.createElement("div");
      banner.id = "judge-overlay-banner";
      banner.style.position = "fixed";
      banner.style.bottom = "20px";
      banner.style.left = "50%";
      banner.style.transform = "translateX(-50%)";
      banner.style.zIndex = "999999";
      banner.style.width = "90%";
      banner.style.maxWidth = "960px";
      banner.style.backgroundColor = "rgba(18, 18, 22, 0.94)";
      banner.style.backdropFilter = "blur(16px)";
      banner.style.border = "1px solid rgba(165, 101, 255, 0.4)";
      banner.style.borderRadius = "16px";
      banner.style.boxShadow = "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(165, 101, 255, 0.2)";
      banner.style.padding = "14px 24px";
      banner.style.color = "#ffffff";
      banner.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      banner.style.display = "flex";
      banner.style.alignItems = "center";
      banner.style.justifyContent = "space-between";
      banner.style.gap = "20px";
      banner.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
      banner.style.pointerEvents = "none";

      banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 14px; flex: 1;">
          <div style="width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, #a565ff, #7928ca); display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 15px rgba(165,101,255,0.4); flex-shrink: 0;">
            🧠
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span id="judge-step-badge" style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; background: rgba(165, 101, 255, 0.25); color: #c49aff; border: 1px solid rgba(165,101,255,0.4); padding: 2px 8px; border-radius: 9999px;">
                STEP 1 / 6
              </span>
              <span id="judge-title" style="font-size: 15px; font-weight: 700; color: #ffffff; letter-spacing: -0.01em;">
                LegacyFi • Autonomous Estate Vault
              </span>
            </div>
            <p id="judge-desc" style="margin: 3px 0 0 0; font-size: 13px; color: #a1a1aa; line-height: 1.4;">
              Initializing AI memory state and onchain Base Sepolia connectivity.
            </p>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981;"></div>
            <span style="font-size: 11px; font-weight: 600; color: #e4e4e7;">Sibyl Labs Agent Memory</span>
          </div>
          <span style="font-size: 10px; font-family: monospace; color: #71717a;">Base Sepolia • Chain ID 84532</span>
        </div>
      `;

      document.body.appendChild(banner);

      // Add visual mouse follower
      if (!document.getElementById("custom-mouse-follower")) {
        const dot = document.createElement("div");
        dot.id = "custom-mouse-follower";
        dot.style.position = "fixed";
        dot.style.width = "22px";
        dot.style.height = "22px";
        dot.style.borderRadius = "50%";
        dot.style.backgroundColor = "rgba(165, 101, 255, 0.45)";
        dot.style.border = "2px solid #a565ff";
        dot.style.boxShadow = "0 0 15px #a565ff";
        dot.style.pointerEvents = "none";
        dot.style.zIndex = "9999999";
        dot.style.transform = "translate(-50%, -50%)";
        dot.style.transition = "transform 0.08s ease, width 0.2s, height 0.2s, background-color 0.2s";
        document.body.appendChild(dot);

        window.addEventListener("mousemove", (e) => {
          dot.style.left = e.clientX + "px";
          dot.style.top = e.clientY + "px";
        });

        window.addEventListener("mousedown", () => {
          dot.style.width = "32px";
          dot.style.height = "32px";
          dot.style.backgroundColor = "rgba(236, 72, 153, 0.6)";
          dot.style.borderColor = "#ec4899";
        });

        window.addEventListener("mouseup", () => {
          dot.style.width = "22px";
          dot.style.height = "22px";
          dot.style.backgroundColor = "rgba(165, 101, 255, 0.45)";
          dot.style.borderColor = "#a565ff";
        });
      }
    });
  };

  // Helper to update judge banner content smoothly
  const updateJudgeBanner = async (stepNumber, title, description, badgeText) => {
    console.log(`\n📢 [STEP ${stepNumber}] ${title}`);
    console.log(`   💡 ${description}`);
    await page.evaluate(
      ({ stepNumber, title, description, badgeText }) => {
        const badge = document.getElementById("judge-step-badge");
        const t = document.getElementById("judge-title");
        const d = document.getElementById("judge-desc");
        const banner = document.getElementById("judge-overlay-banner");
        if (badge) badge.innerText = badgeText || `STEP ${stepNumber} / 6`;
        if (t) t.innerText = title;
        if (d) d.innerText = description;
        if (banner) {
          banner.style.transform = "translateX(-50%) scale(1.02)";
          setTimeout(() => {
            if (banner) banner.style.transform = "translateX(-50%) scale(1)";
          }, 200);
        }
      },
      { stepNumber, title, description, badgeText }
    );
  };

  // Human-like smooth typing helper
  const humanType = async (locator, text) => {
    await locator.click();
    await locator.fill("");
    for (const char of text) {
      await locator.pressSequentially(char, { delay: 28 });
    }
  };

  // Smooth mouse move & click helper
  const clickWithCursor = async (locator) => {
    const box = await locator.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 12 });
      await page.waitForTimeout(300);
      await locator.click();
    } else {
      await locator.click();
    }
  };

  console.log("🚀 Navigating to http://localhost:3000/?view=app...");
  await page.goto("http://localhost:3000/?view=app", { waitUntil: "networkidle" });
  await injectJudgeOverlay();
  await page.waitForTimeout(1500);

  // =========================================================================
  // STEP 1: Top Status Cards & Estate Studio
  // =========================================================================
  await updateJudgeBanner(
    1,
    "Estate Overview & Sibyl Memory Status",
    "Live dashboard displaying active Sibyl entity memory count, Base Sepolia testnet sync, and beneficiary allocations.",
    "STEP 1 • ARCHITECTURE"
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await page.waitForTimeout(3500);

  // =========================================================================
  // STEP 2: Agent Chat & Memory Ingestion
  // =========================================================================
  await updateJudgeBanner(
    2,
    "Life-Stage Context Ingestion into Sibyl Memory",
    "Estate owner tells the AI: Brother Marcus is studying in university. Sibyl parses this into a persistent WARM entity.",
    "STEP 2 • CONTEXT INGESTION"
  );

  const agentTabButton = page.locator("button:has-text('Agent Chat')").first();
  if (await agentTabButton.isVisible()) {
    await clickWithCursor(agentTabButton);
    await injectJudgeOverlay();
    await page.waitForTimeout(1500);

    const chatInput = page.locator("input[placeholder*='brother'], input[placeholder*='message'], input[type='text']").last();
    if (await chatInput.isVisible()) {
      await humanType(
        chatInput,
        "My brother Marcus is currently studying computer science in college. Please release his 30% share gradually over 4 years for tuition."
      );
      await page.waitForTimeout(600);

      const sendBtn = page.locator("button:has-text('Send'), button:has(svg.lucide-send), button:has-text('Submit')").last();
      if (await sendBtn.isVisible()) {
        await clickWithCursor(sendBtn);
        await page.waitForTimeout(3500);
      }
    }
  }

  // =========================================================================
  // STEP 3: Fresh Session Started (Zero Chat Context)
  // =========================================================================
  await updateJudgeBanner(
    3,
    "Cross-Session Persistence Test (Fresh Session)",
    "Chat history is wiped with 0 conversation context. AI relies strictly on persistent Sibyl Memory (SQLite FTS5).",
    "STEP 3 • FRESH SESSION"
  );

  const freshSessionBtn = page.locator("button:has-text('Fresh Session')").first();
  if (await freshSessionBtn.isVisible()) {
    await clickWithCursor(freshSessionBtn);
    await page.waitForTimeout(2000);

    const recallQueryInput = page.locator("input[placeholder*='message'], input[type='text']").last();
    if (await recallQueryInput.isVisible()) {
      await humanType(recallQueryInput, "What did I specify about my brother Marcus's inheritance?");
      await page.waitForTimeout(500);

      const sendBtn2 = page.locator("button:has-text('Send'), button:has(svg.lucide-send), button:has-text('Submit')").last();
      if (await sendBtn2.isVisible()) {
        await clickWithCursor(sendBtn2);
        await page.waitForTimeout(4000);
      }
    }
  }

  // =========================================================================
  // STEP 4: Memory-Influenced Decision & Load-Bearing A/B Proof
  // =========================================================================
  await updateJudgeBanner(
    4,
    "Memory-Influenced Decision & Load-Bearing A/B Proof",
    "Demonstrating decision shift: With Sibyl Memory (4-Year Educational Vesting) vs Without Memory (Naive Lump Sum Fallback).",
    "STEP 4 • DECISION SHIFT"
  );

  const studioTabButton = page.locator("button:has-text('Estate Studio'), button:has-text('Dashboard')").first();
  if (await studioTabButton.isVisible()) {
    await clickWithCursor(studioTabButton);
    await injectJudgeOverlay();
    await page.waitForTimeout(1500);

    // Scroll smoothly to decision card
    await page.evaluate(() => window.scrollBy({ top: 380, behavior: "smooth" }));
    await page.waitForTimeout(2000);

    // Toggle "Without Memory" to show the failure/fallback mode
    const withoutMemoryToggle = page.locator("button:has-text('Without Memory')").first();
    if (await withoutMemoryToggle.isVisible()) {
      await clickWithCursor(withoutMemoryToggle);
      await page.waitForTimeout(3000);
    }

    // Toggle back to "With Sibyl Memory" to show intelligent adaptation
    const withMemoryToggle = page.locator("button:has-text('With Sibyl Memory')").first();
    if (await withMemoryToggle.isVisible()) {
      await clickWithCursor(withMemoryToggle);
      await page.waitForTimeout(3000);
    }
  }

  // =========================================================================
  // STEP 5: Real Base Sepolia Smart Contract Deployment
  // =========================================================================
  await updateJudgeBanner(
    5,
    "Real Onchain Smart Contract Deployment on Base Sepolia",
    "Deploying dedicated Solidity InheritanceVault contract instance with verified bytecode to Base Sepolia (84532).",
    "STEP 5 • BASE SETTLEMENT"
  );

  await page.evaluate(() => window.scrollBy({ top: 400, behavior: "smooth" }));
  await page.waitForTimeout(1500);

  const deployVaultBtn = page.locator("button:has-text('Deploy Dedicated Vault')").first();
  if (await deployVaultBtn.isVisible()) {
    await clickWithCursor(deployVaultBtn);
    await page.waitForTimeout(4500);
  }

  // =========================================================================
  // STEP 6: Sibyl 5-Tier Memory & Connectome Inspector
  // =========================================================================
  await updateJudgeBanner(
    6,
    "Sibyl Connectome & 5-Tier Memory Inspector",
    "Inspecting Hot (Working), Warm (Entities & SQLite FTS5), and Cold (Vector/Journal) memory tiers in real-time.",
    "STEP 6 • MEMORY INSPECTOR"
  );

  const inspectorTabButton = page.locator("button:has-text('Sibyl Inspector'), button:has-text('Connectome')").first();
  if (await inspectorTabButton.isVisible()) {
    await clickWithCursor(inspectorTabButton);
    await injectJudgeOverlay();
    await page.waitForTimeout(3500);
  }

  // Final Summary Banner
  await updateJudgeBanner(
    6,
    "Summary: Memory → Decision → Action Complete",
    "LegacyFi combines Sibyl Labs memory persistence with Base smart contracts to automate intelligent life-stage inheritance.",
    "🎉 COMPLETE"
  );
  await page.waitForTimeout(3000);

  console.log("💾 Finalizing video stream...");
  await page.close();
  await context.close();
  await browser.close();

  // Rename latest recording
  const files = fs.readdirSync(recordingsDir).filter((f) => f.endsWith(".webm"));
  if (files.length > 0) {
    const latestFile = files.sort((a, b) => {
      return fs.statSync(path.join(recordingsDir, b)).mtimeMs - fs.statSync(path.join(recordingsDir, a)).mtimeMs;
    })[0];

    const targetName = `legacyfi-judge-demo-${Date.now()}.webm`;
    fs.renameSync(path.join(recordingsDir, latestFile), path.join(recordingsDir, targetName));
    console.log(`\n🎉 High-Production Demo Video Complete!`);
    console.log(`📹 Video saved to: recordings/${targetName}`);
    console.log(`💡 You can submit this video or upload to YouTube/Loom for hackathon judges.`);
  }
}

runDemoRecording().catch((err) => {
  console.error("❌ Recording script error:", err);
  process.exit(1);
});
