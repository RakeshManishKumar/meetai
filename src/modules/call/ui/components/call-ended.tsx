import { LogInIcon } from "lucide-react";
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { generateAvatarUri } from "@/lib/avatar";
import Link from "next/link";
import "@stream-io/video-react-sdk/dist/css/styles.css";
  

export const CallEnded = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-sidebar-accent/20 to-sidebar/20 p-4">
      <div className="flex w-full max-w-2xl flex-col items-center gap-10 rounded-xl bg-background p-10 shadow-sm">
        <div className="w-full text-center space-y-3">
          <h2 className="text-3xl font-semibold text-red-500">Call has been ended</h2>
          <p className="text-lg text-muted-foreground">
          Summary of the call will be available here in few minutes .
          </p>
        </div>
        <Button asChild variant="outline" size="lg" className="w-full text-base sm:flex-1 bg-green-500 text-white hover:bg-green-600">
          <Link href="/meetings" className="py-6">
            Back to meetings
          </Link>
        </Button>
      </div>
    </div>
  );
};
