// src/app/not-found.tsx
"use client"; // Framer Motion and its hooks require client components

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HomeIcon, AlertTriangleIcon } from "lucide-react"; // Icons

export default function NotFound() {
  // Variants for the main container to stagger children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2, // Start children animations after a slight delay
        staggerChildren: 0.3, // Stagger each child's animation
      },
    },
  };

  // Variants for individual items (icon, text, button)
  const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring", // Smooth spring animation
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Variants for each digit of "404"
  const digitVariants = {
    hidden: { y: -60, opacity: 0, rotateZ: -30, scale: 0.7 },
    visible: (i: number) => ({ // 'i' is a custom prop for dynamic delay
      y: 0,
      opacity: 1,
      rotateZ: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10,
        delay: i * 0.15, // Stagger delay for each digit
      },
    }),
  };

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center bg-background text-center px-6 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated Icon */}
      <motion.div variants={itemVariants} className="mb-6 md:mb-8">
        <AlertTriangleIcon className="h-20 w-20 md:h-28 md:w-28 text-destructive animate-pulse" />
      </motion.div>

      {/* Animated "404" Text */}
      <motion.div className="flex mb-4">
        {['4', '0', '4'].map((digit, index) => (
          <motion.h1
            key={index}
            custom={index} // Pass index to variants for staggered delay
            variants={digitVariants}
            className="text-8xl sm:text-9xl md:text-[150px] font-extrabold text-primary tracking-tighter select-none"
          >
            {digit}
          </motion.h1>
        ))}
      </motion.div>

      {/* Animated Title */}
      <motion.h2
        variants={itemVariants}
        className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-3"
      >
        Oops! Page Not Found
      </motion.h2>

      {/* Animated Description */}
      <motion.p
        variants={itemVariants}
        className="text-muted-foreground md:text-lg mb-8 max-w-md"
      >
        It looks like the page you're searching for is lost in the cornfield or doesn't exist. Let's get you back on track.
      </motion.p>

      {/* Animated Button */}
      <motion.div variants={itemVariants}>
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          // Framer Motion hover/tap effects (optional, can be more elaborate)
          // whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          // whileTap={{ scale: 0.95 }}
        >
          <Link href="/">
            <HomeIcon className="mr-2 h-5 w-5" />
            Return to Homepage
          </Link>
        </Button>
      </motion.div>

      {/* Optional: A subtle animated background element or shape */}
      {/* <motion.div
        className="absolute -z-10 top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full filter blur-2xl opacity-50"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 15,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
      */}
    </motion.div>
  );
}