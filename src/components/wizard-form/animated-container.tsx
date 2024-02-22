import { ComponentProps } from 'react'
import { motion } from 'framer-motion'

export interface AnimatedContainerProps
  extends ComponentProps<typeof motion.div> {
  direction?: number
}

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }
  },
}

export function AnimatedContainer({
  direction = 1,
  ...props
}: AnimatedContainerProps) {
  return (
    <motion.div
      key="sliders"
      variants={variants}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
      className="flex w-96 flex-col gap-3 bg-red-300"
      {...props}
    />
  )
}
