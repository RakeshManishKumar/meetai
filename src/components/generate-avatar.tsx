import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GenerateAvatarProps {
  seed: string;
  className?: string;
  variant?: "botttsNeutral" | "initials";
}

export const GenerateAvatar = ({ seed, className, variant }: GenerateAvatarProps) => {
  let avatar;
  if (variant === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, {
      seed: seed,
    });
  } else {
    avatar = createAvatar(initials, {
      seed: seed,
      size: 42,
      fontWeight: 500,
    });
  }

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar.toDataUri()} alt="avatar" />
      <AvatarFallback>
        {seed.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
