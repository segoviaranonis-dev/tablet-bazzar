export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CadenaLayout({ children }: { children: React.ReactNode }) {
  const build = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";

  return (
    <>
      {children}
      <p className="pointer-events-none fixed bottom-1 right-2 z-[100] text-[9px] font-mono text-slate-400/80">
        pos · {build}
      </p>
    </>
  );
}
