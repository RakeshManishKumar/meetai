import { StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";
interface CallUIProps {
  meetingName: string;
}
interface CallLobbyProps {
  onJoin: () => void;
  isJoining?: boolean;
  joinError?: string | null;
}
export const CallUI = ({ meetingName }: CallUIProps) => {
  const call = useCall();
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const handleJoin = async () => {
    if (!call || isJoining) return;

    setJoinError(null);
    setIsJoining(true);

    try {
      console.log('Attempting to join call...');
      await call.join({ create: true });
      console.log('Successfully joined call');
      setShow("call");
    } catch (error) {
      console.error('Failed to join call:', error);
      setJoinError('Failed to join the call. Please try again.');
      
      // Reset the call state
      try {
        await call.leave();
      } catch (leaveError) {
        console.error('Error during call leave after join failure:', leaveError);
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!call) return;

    try {
      console.log('Leaving call...');
      await call.endCall();
      setShow("ended");
    } catch (error) {
      console.error('Error leaving call:', error);
    }
  };

  return (
    <StreamTheme className="h-full">
      {show === "lobby" && (
        <CallLobby 
          onJoin={handleJoin} 
          isJoining={isJoining}
          joinError={joinError}
        />
      )}
      {show === "call" && (
        <CallActive 
          onLeave={handleLeave} 
          meetingName={meetingName} 
        />
      )}
      {show === "ended" && <CallEnded />}
    </StreamTheme>
  );
};
