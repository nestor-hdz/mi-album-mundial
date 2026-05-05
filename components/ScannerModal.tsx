"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ALL_STICKERS, type Sticker } from "@/lib/stickers";

// ── Lookup helpers ────────────────────────────────────────────────────────────

/** O(1) map from "FRA-20" → Sticker */
const stickerByCode = new Map(ALL_STICKERS.map((s) => [s.code, s]));

/** Every unique prefix that appears in the album, e.g. ["P","FWC","MEX",…,"MM"] */
const ALL_PREFIXES = Array.from(new Set(ALL_STICKERS.map((s) => s.code.split("-")[0])));

/**
 * Build a regex that matches any known prefix followed by a space and 1-2 digits.
 * Prefixes are sorted longest-first to avoid partial matches (e.g. "NZL" before "NZ").
 */
const OCR_PATTERN = new RegExp(
  `\\b(${ALL_PREFIXES.sort((a, b) => b.length - a.length).join("|")})[ \\t]+(\\d{1,2})\\b`,
  "gi"
);

function parseOcrText(text: string): Sticker | null {
  // Reset lastIndex — regex is stateful when using the 'g' flag
  OCR_PATTERN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = OCR_PATTERN.exec(text)) !== null) {
    const sticker = stickerByCode.get(`${match[1].toUpperCase()}-${match[2]}`);
    if (sticker) return sticker;
  }
  return null;
}

// ── Component ────────────────────────────────────────────────────────────────

type Status = "starting" | "ready" | "processing" | "match" | "nomatch" | "error";

interface Props {
  open: boolean;
  onClose: () => void;
  onMatch: (sticker: Sticker) => void;
}

export default function ScannerModal({ open, onClose, onMatch }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<Status>("starting");
  const [lastFound, setLastFound] = useState<Sticker | null>(null);
  const [cameraError, setCameraError] = useState("");

  // Start / stop camera stream with the modal
  useEffect(() => {
    if (!open) return;

    setStatus("starting");
    setCameraError("");

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setStatus("ready");

        // Warm up the Tesseract worker in the background so the first scan is faster
        import("@/lib/tessWorker")
          .then(({ getTesseractWorker }) => getTesseractWorker())
          .catch(() => {});
      })
      .catch((err: DOMException) => {
        setCameraError(
          err.name === "NotAllowedError"
            ? "Permiso de cámara denegado. Actívalo en la configuración del navegador."
            : "No se pudo acceder a la cámara en este dispositivo."
        );
        setStatus("error");
      });

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [open]);

  const capture = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || status !== "ready") return;

    setStatus("processing");

    // ── Draw & preprocess ──────────────────────────────────────────────────
    // Crop to the central 60 % × 50 % of the frame — that's where the guide
    // rectangle sits and where the user positions the sticker.
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const cropX = Math.round(vw * 0.2);
    const cropY = Math.round(vh * 0.25);
    const cropW = Math.round(vw * 0.6);
    const cropH = Math.round(vh * 0.5);

    canvas.width = cropW;
    canvas.height = cropH;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    // Grayscale conversion improves OCR accuracy under varying lighting
    const imgData = ctx.getImageData(0, 0, cropW, cropH);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const gray = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
      d[i] = d[i + 1] = d[i + 2] = gray;
    }
    ctx.putImageData(imgData, 0, 0);

    // ── OCR ───────────────────────────────────────────────────────────────
    try {
      const { getTesseractWorker } = await import("@/lib/tessWorker");
      const worker = await getTesseractWorker();
      const {
        data: { text },
      } = await worker.recognize(canvas);

      const found = parseOcrText(text);

      if (found) {
        setLastFound(found);
        setStatus("match");
        onMatch(found);
        setTimeout(() => setStatus("ready"), 2200);
      } else {
        setStatus("nomatch");
        setTimeout(() => setStatus("ready"), 2000);
      }
    } catch {
      setStatus("nomatch");
      setTimeout(() => setStatus("ready"), 2000);
    }
  }, [status, onMatch]);

  if (!open) return null;

  const isCapturing = status === "processing";

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="shrink-0 flex justify-between items-center px-4 py-3 bg-black/80 safe-top">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          Escanear estampa
        </span>
        <button
          className="text-slate-400 hover:text-white text-2xl leading-none cursor-pointer bg-transparent border-0 p-1"
          onClick={onClose}
          aria-label="Cerrar escáner"
        >
          ✕
        </button>
      </div>

      {/* Viewfinder */}
      <div className="flex-1 relative overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />

        {/* Hidden canvas used for frame capture / preprocessing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Dark vignette + guide rectangle */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Dimmed overlay with a transparent cutout in the centre */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 w-64 h-28 mix-blend-normal">
            {/* Transparent centre — clears the overlay */}
            <div className="absolute inset-0 bg-transparent" />
            {/* Corner brackets */}
            {(
              [
                "top-0 left-0 border-t-[3px] border-l-[3px] rounded-tl",
                "top-0 right-0 border-t-[3px] border-r-[3px] rounded-tr",
                "bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl",
                "bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br",
              ] as const
            ).map((cls, i) => (
              <div key={i} className={`absolute w-7 h-7 border-amber-400 ${cls}`} />
            ))}
          </div>
        </div>

        {/* Status overlays */}
        {isCapturing && (
          <div className="absolute inset-0 z-20 bg-black/60 flex flex-col items-center justify-center gap-3">
            <div className="w-9 h-9 border-[3px] border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm font-semibold">Leyendo código…</p>
          </div>
        )}

        {status === "match" && lastFound && (
          <div className="absolute inset-0 z-20 bg-emerald-900/80 flex flex-col items-center justify-center gap-2">
            <div className="text-5xl">✅</div>
            <p className="text-white text-2xl font-extrabold tracking-wide">{lastFound.code}</p>
            <p className="text-emerald-300 text-sm">{lastFound.sectionLabel}</p>
          </div>
        )}

        {status === "nomatch" && (
          <div className="absolute inset-0 z-20 bg-red-900/70 flex flex-col items-center justify-center gap-2 px-8">
            <div className="text-5xl">❌</div>
            <p className="text-white text-sm font-semibold text-center">
              No se reconoció ningún código.
            </p>
            <p className="text-red-300 text-xs text-center">
              Acerca más la cámara al reverso de la estampa e intenta de nuevo.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 z-20 bg-black/90 flex items-center justify-center p-8">
            <p className="text-red-400 text-sm text-center leading-relaxed">{cameraError}</p>
          </div>
        )}
      </div>

      {/* Footer / capture button */}
      <div className="shrink-0 bg-black/80 px-6 py-5 flex flex-col items-center gap-2 safe-bottom">
        <p className="text-xs text-slate-400 text-center">
          Apunta al <strong className="text-slate-200">reverso</strong> de la estampa y centra el código dentro del recuadro
        </p>
        <button
          className="mt-1 w-16 h-16 rounded-full bg-white border-4 border-slate-400 flex items-center justify-center text-2xl disabled:opacity-30 cursor-pointer active:scale-95 transition-transform"
          onClick={capture}
          disabled={status !== "ready"}
          aria-label="Capturar imagen"
        >
          📷
        </button>
      </div>
    </div>
  );
}
