export default function MessyDoc({ bananas = false, className = "" }: { bananas?: boolean; className?: string }) {
  const lines = [
    { w: "w-3/4", r: "-rotate-2", c: "bg-gray-400" },
    { w: "w-full", r: "rotate-1", c: "bg-gray-300" },
    { w: "w-5/6", r: "-rotate-1", c: "bg-gray-300" },
    { w: "w-2/3", r: "rotate-3", c: "bg-gray-300" },
    { w: "w-full", r: "-rotate-2", c: "bg-gray-300" },
    { w: "w-1/2", r: "rotate-2", c: "bg-gray-300" },
    { w: "w-4/5", r: "-rotate-3", c: "bg-gray-300" },
  ];
  return (
    <div className={`relative mx-auto w-56 rotate-3 rounded-lg bg-white p-4 text-gray-700 shadow-2xl ${className}`}>
      <div className="mb-3 -rotate-3 font-serif text-xs text-gray-500">maya's school newsletter</div>
      <div className="space-y-2">
        {lines.map((l, i) => (
          <div key={i} className={`h-2 rounded ${l.w} ${l.r} ${l.c}`} />
        ))}
      </div>
      <div className="absolute right-3 top-10 h-10 w-10 rounded-full bg-amber-700/30 blur-[2px]" title="coffee stain" />
      <div className="absolute bottom-6 left-6 text-2xl">❓</div>
      <div className="absolute -right-3 -top-3 rotate-12 rounded bg-red-500 px-2 py-0.5 text-xs font-bold text-white">MESSY!</div>
      {bananas && (
        <div className="mt-2 flex flex-wrap gap-1 text-[10px] font-bold text-yellow-600">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>BANANA</span>
          ))}
        </div>
      )}
    </div>
  );
}
