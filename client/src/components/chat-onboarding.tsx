import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MessageSquare, Sparkles, Bot } from "lucide-react";

interface ChatOnboardingProps {
  category: string;
  onComplete: () => void;
}

export default function ChatOnboarding({ category, onComplete }: ChatOnboardingProps) {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const welcomeMessages = {
    finance: [
      "Hi there! 👋 I'm your AI Financial Advisor",
      "I'm here to help you manage your money better",
      "Let's start by understanding your financial goals"
    ],
    career: [
      "Welcome! 👋 I'm your AI Career Coach",
      "I'm here to guide your professional growth",
      "Let's explore your career aspirations"
    ],
    wellness: [
      "Hello! 👋 I'm your AI Wellness Guide",
      "I'm here to support your well-being journey",
      "Let's work on your health and happiness"
    ],
    learning: [
      "Hi there! 👋 I'm your AI Learning Coach",
      "I'm here to help you learn and grow",
      "Let's discover new skills together"
    ],
    fitness: [
      "Welcome! 👋 I'm your AI Fitness Coach",
      "I'm here to guide your fitness journey",
      "Let's achieve your fitness goals together"
    ]
  };

  const messages = welcomeMessages[category as keyof typeof welcomeMessages] || welcomeMessages.wellness;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step < messages.length - 1) {
        setStep(step + 1);
      } else {
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(onComplete, 500);
        }, 2000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [step, messages.length, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="mb-6"
          >
            <div className="relative inline-block">
              <Bot className="w-16 h-16 text-primary" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </motion.div>
            </div>
          </motion.div>

          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: index <= step ? 1 : 0,
                  x: index <= step ? 0 : -20
                }}
                className="flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5 text-primary" />
                <p className="text-lg font-medium">{message}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8"
          >
            <p className="text-sm text-muted-foreground">
              I'm powered by AI to provide personalized guidance
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
