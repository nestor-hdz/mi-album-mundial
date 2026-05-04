// Swap in the real <ins> tag once AdSense approves the site
export default function AdSlot({ slot, className = "" }: { slot: string; className?: string }) {
  if (process.env.NODE_ENV !== "production") return null;
  return (
    <div className={`flex justify-center ${className}`} data-ad-slot={slot}>
      {/* ins.adsbygoogle goes here */}
    </div>
  );
}
