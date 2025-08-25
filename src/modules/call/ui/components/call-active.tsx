import Link from "next/link";
import Image from "next/image";
import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";

interface CallActiveProps {
  onLeave: () => void;
  meetingName: string;
}

export const CallActive = ({ onLeave, meetingName }: CallActiveProps) => {
  return (
    <div className="flex h-screen flex-col bg-[#0e0f10] text-white">
      {/* Header */}
      <div className="flex items-center gap-3 bg-[#101213] p-4 shadow-sm">
        <Link
          href="/"
          className="flex items-center justify-center rounded-full bg-white/10 p-1"
        >
          <Image src="/logo.svg" alt="Logo" width={22} height={22} />
        </Link>
        <h4 className="text-base font-medium">{meetingName}</h4>
      </div>

      {/* Video Area - Centered */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-5xl">
          <SpeakerLayout />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center bg-[#101213] p-3">
        <div className="rounded-full bg-[#1a1c1f] px-6 py-2">
          <CallControls onLeave={onLeave} />
        </div>
      </div>
    </div>
  );
};
