import { LoaderIcon, LogInIcon } from "lucide-react";
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
import { motion } from "framer-motion";
import "@stream-io/video-react-sdk/dist/css/styles.css";

interface CallLobbyProps {
  onJoin: () => void;
  isJoining?: boolean;
  joinError?: string | null;
}

const DisableVideoPreview = () => {
  const { data } = authClient.useSession();

  if (!data?.user) return null;

  return (
    <div className="flex h-full w-full items-center justify-center bg-secondary">
      <DefaultVideoPlaceholder
        participant={{
          name: data.user.name || "",
          image:
            data.user.image ||
            generateAvatarUri({
              seed: data.user.name || "",
              variant: "initials",
            }),
        } as StreamVideoParticipant}
      />
    </div>
  );
};

const AllowBrowserPermission = () => (
  <div className="flex h-full w-full items-center justify-center bg-secondary px-4">
    <p className="text-sm text-muted-foreground text-center leading-relaxed">
      Please allow browser permissions to access your{" "}
      <span className="font-medium text-foreground">camera</span> and{" "}
      <span className="font-medium text-foreground">microphone</span> before
      joining the call.
    </p>
  </div>
);

export const CallLobby = ({
  onJoin,
  isJoining = false,
  joinError = null,
}: CallLobbyProps) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();
  const { hasBrowserPermission: hasMicrophonePermission } = useMicrophoneState();

  const hasAllPermissions = hasCameraPermission && hasMicrophonePermission;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex w-full max-w-3xl flex-col items-center gap-10 rounded-2xl bg-white p-10 shadow-xl border border-indigo-100"
      >
        {/* Header */}
        <div className="w-full text-center space-y-3">
          <h2 className="text-4xl font-bold tracking-tight text-indigo-700">
            Ready to join?
          </h2>
          <p className="text-lg text-gray-600">
            Configure your audio & video settings before entering the call.
          </p>
        </div>

        {/* Video Preview */}
        <div
          className="relative w-full overflow-hidden rounded-xl border bg-secondary/20 shadow-inner"
          style={{ aspectRatio: "16/9" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <VideoPreview
              DisabledVideoPreview={
                hasAllPermissions ? DisableVideoPreview : AllowBrowserPermission
              }
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex w-full items-center justify-center gap-8">
          <div className="scale-125">
            <ToggleAudioPreviewButton />
          </div>
          <div className="scale-125">
            <ToggleVideoPreviewButton />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid w-full grid-cols-2 gap-6 sm:flex sm:flex-row">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full text-base sm:flex-1 py-6 rounded-xl"
          >
            <Link href="/meetings">Cancel</Link>
          </Button>
          <Button
            onClick={onJoin}
            size="lg"
            className="w-full gap-3 text-base sm:flex-1 py-6 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all"
            disabled={isJoining}
          >
            {isJoining ? (
              <>
                <LoaderIcon className="h-5 w-5 animate-spin" />
                <span>Joining...</span>
              </>
            ) : (
              <>
                <LogInIcon className="h-5 w-5" />
                <span>Join Call</span>
              </>
            )}
          </Button>
        </div>

        {/* Error Message */}
        {joinError && (
          <p className="text-sm text-red-500 mt-2 font-medium">{joinError}</p>
        )}
      </motion.div>
    </div>
  );
};
