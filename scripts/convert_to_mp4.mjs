import ffmpegPath from "ffmpeg-static";
import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

const execFilePromise = util.promisify(execFile);

async function convertWebmToMp4() {
  const recordingsDir = path.resolve("./recordings");
  if (!fs.existsSync(recordingsDir)) {
    console.error("No recordings directory found.");
    process.exit(1);
  }

  const webmFiles = fs.readdirSync(recordingsDir).filter((f) => f.endsWith(".webm"));
  if (webmFiles.length === 0) {
    console.log("No .webm files found in recordings/ to convert.");
    return;
  }

  // Find the most recent webm recording
  const latestWebm = webmFiles.sort((a, b) => {
    return fs.statSync(path.join(recordingsDir, b)).mtimeMs - fs.statSync(path.join(recordingsDir, a)).mtimeMs;
  })[0];

  const inputPath = path.join(recordingsDir, latestWebm);
  const outputName = latestWebm.replace(/\.webm$/, ".mp4");
  const outputPath = path.join(recordingsDir, outputName);
  const latestJudgeMp4 = path.join(recordingsDir, "legacyfi-judge-demo.mp4");

  console.log(`🎬 Converting ${latestWebm} to MP4 using ffmpeg...`);
  console.log(`Input:  ${inputPath}`);
  console.log(`Output: ${outputPath}`);

  // ffmpeg args for high quality MP4 conversion compatible with all players/browsers
  const args = [
    "-y", // overwrite
    "-i", inputPath,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-preset", "fast",
    "-crf", "22",
    "-movflags", "+faststart",
    outputPath,
  ];

  try {
    await execFilePromise(ffmpegPath, args);
    // Also copy to legacyfi-judge-demo.mp4 for convenience
    fs.copyFileSync(outputPath, latestJudgeMp4);
    
    console.log(`\n🎉 MP4 Conversion Successful!`);
    console.log(`📹 Saved to: recordings/${outputName}`);
    console.log(`⭐ Standard Link: recordings/legacyfi-judge-demo.mp4`);
  } catch (err) {
    console.error("❌ FFmpeg conversion error:", err);
    process.exit(1);
  }
}

convertWebmToMp4().catch((err) => {
  console.error("Error running converter:", err);
  process.exit(1);
});
