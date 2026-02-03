import { Variants } from "framer-motion"

export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 24
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
}

export const legalFade: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8
    }
  }
}

export const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1]

function base(delay = 0, y = 24): Variants {
  return {
    hidden: {
      opacity: 0,
      y
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.6,
        ease: EASE
      }
    }
  }
}

/**
 * Níveis institucionais de peso visual
 */
export const motionLevels = {
  public: base(0, 20),      // Hero / títulos
  technical: base(0.1, 24), // Cards / blocos técnicos
  legal: base(0.2, 28)     // Rodapé / hash / validação
}

