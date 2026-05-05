/**
 * Singleton Tesseract.js worker — initialised once, reused across scans.
 * Lazy-imported so the ~10 MB WASM bundle never loads until the scanner is opened.
 */
import type { Worker } from "tesseract.js";

let workerPromise: Promise<Worker> | null = null;

export async function getTesseractWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = boot().catch((err) => {
      // Allow retry on next call if boot fails
      workerPromise = null;
      throw err;
    });
  }
  return workerPromise;
}

async function boot(): Promise<Worker> {
  const { createWorker } = await import("tesseract.js");

  const worker = await createWorker("eng", 1, {
    // Suppress noisy progress logs in the console
    logger: () => {},
  });

  await worker.setParameters({
    // Restrict character set to what sticker codes can contain
    tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ",
    // PSM 11 — sparse text: find as much text as possible in no particular order.
    // Best for a full camera frame where the code can appear anywhere.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tessedit_pageseg_mode: "11" as any,
  });

  return worker;
}
