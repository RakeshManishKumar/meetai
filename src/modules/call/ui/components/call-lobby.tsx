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
interface CallLobbyProps {
  onJoin: () => void;
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
    <div className="flex h-full w-full items-center justify-center bg-secondary">
      <p className="text-sm text-muted-foreground text-center">
        Please allow browser permissions to access your camera and microphone
      </p>
    </div>
  );
  

export const CallLobby = ({ onJoin }: CallLobbyProps) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();
  const { hasBrowserPermission: hasMicrophonePermission } = useMicrophoneState();

  const hasAllPermissions = hasCameraPermission && hasMicrophonePermission;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-sidebar-accent/20 to-sidebar/20 p-4">
      <div className="flex w-full max-w-2xl flex-col items-center gap-10 rounded-xl bg-background p-10 shadow-sm">
        <div className="w-full text-center space-y-3">
          <h2 className="text-3xl font-semibold">Ready to join the call?</h2>
          <p className="text-lg text-muted-foreground">
            Set up your audio and video before joining
          </p>
        </div>

        <div className="relative w-full overflow-hidden rounded-lg border bg-secondary/20" style={{ aspectRatio: '16/9' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <VideoPreview
              DisabledVideoPreview={hasAllPermissions ? DisableVideoPreview : AllowBrowserPermission}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-center gap-6">
          <div className="scale-125">
            <ToggleAudioPreviewButton />
          </div>
          <div className="scale-125">
            <ToggleVideoPreviewButton />
          </div>
        </div>

        <div className="mt-6 grid w-full grid-cols-2 gap-6 sm:flex sm:flex-row">
          <Button asChild variant="outline" size="lg" className="w-full text-base sm:flex-1">
            <Link href="/meetings" className="py-6">
              Cancel
            </Link>
          </Button>
          <Button 
            onClick={onJoin} 
            size="lg"
            className="w-full gap-3 text-base sm:flex-1 py-6"
          >
            <LogInIcon className="h-5 w-5" />
            <span>Join call</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
