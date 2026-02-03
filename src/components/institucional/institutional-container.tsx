export default function InstitutionalContainer({ children }: { children: React.ReactNode }) {
  return (
    // Removido min-h-screen. max-w-7xl (1280px) ou [1440px] para telas modernas.
    <div className="w-full max-w-[1660px] mx-auto px-4 md:px-12 relative z-10">
      {children}
    </div>
  )
}