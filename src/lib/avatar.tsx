import { createAvatar } from "@dicebear/core";
import {botttsNeutral,initials} from "@dicebear/collection";

interface AvatarProps {
    seed: string;
    variant: "botttsNeutral" | "initials";
}
export const generateAvatarUri = ({seed,variant}:AvatarProps) => {
    let avatar ;
    if(variant === "botttsNeutral") {
        avatar = createAvatar(botttsNeutral,{
            seed:seed,
        })
    }else{
        avatar = createAvatar(initials,{
            seed:seed,
            fontSize:42,
            fontWeight:500,
        })
    }
    return avatar.toDataUri()
}