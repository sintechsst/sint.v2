'use client'

import { motion } from "framer-motion"

export default function LeadsLoading() {
  return (
    <div className="p-8 space-y-8">
      {/* Skeleton do Header */}
      <div className="space-y-3">
        <div className="h-9 w-64 bg-white/5 rounded-lg animate-pulse" />
        <div className="h-4 w-96 bg-white/5 rounded-lg animate-pulse" />
      </div>

      {/* Skeleton da Tabela */}
      <div className="bg-[#11141b] border border-white/5 rounded-2xl overflow-hidden">
        <div className="h-12 bg-white/5 border-b border-white/5" /> {/* Header da Tabela */}
        
        <div className="p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.1
              }}
              className="flex items-center justify-between py-4 border-b border-white/5 last:border-0"
            >
              <div className="h-4 w-[15%] bg-white/5 rounded" />
              <div className="h-4 w-[25%] bg-white/5 rounded" />
              <div className="h-4 w-[20%] bg-white/5 rounded" />
              <div className="h-4 w-[15%] bg-white/5 rounded" />
              <div className="h-4 w-[10%] bg-indigo-500/10 rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}