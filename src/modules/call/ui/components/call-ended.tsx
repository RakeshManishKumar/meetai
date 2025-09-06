import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const CallEnded = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex w-full max-w-xl flex-col items-center gap-8 rounded-2xl bg-white p-10 shadow-xl border border-red-100"
      >
        {/* Header */}
        <div className="w-full text-center space-y-4">
          <h2 className="text-4xl font-bold text-red-600 tracking-tight">
            Call Ended
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            A detailed summary of this call will be available shortly.  
            Please check back in a few minutes.
          </p>
        </div>

        {/* Action */}
        <Button
          asChild
          size="lg"
          className="w-full rounded-xl bg-green-500 text-white text-base font-medium py-6 shadow-sm hover:bg-green-600 hover:shadow-md transition-all"
        >
          <Link href="/meetings">
            Back to Meetings
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};
