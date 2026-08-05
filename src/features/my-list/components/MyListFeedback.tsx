import { AnimatePresence, motion } from 'framer-motion';

type MyListFeedbackProps = {
  message: string | null;
};

export function MyListFeedback({ message }: MyListFeedbackProps) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2"
    >
      <AnimatePresence>
        {message !== null ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-full border border-border bg-surface/95 px-4 py-2 text-sm font-semibold text-foreground shadow-xl shadow-black/30 backdrop-blur"
            exit={{ opacity: 0, y: 8 }}
            initial={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {message}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
