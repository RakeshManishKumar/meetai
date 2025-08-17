import { AlertCircleIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

export const ErrorState = ({ title, description }: Props) => {
  return (
    <div className="m-b-4 flex items-center justify-center min-h-screen w-full">
      <div className="flex flex-col gap-y-6 items-center justify-center bg-background p-10 rounded-lg shadow-sm">
        <AlertCircleIcon className="size-6  text-red-500" />
        <div className="flex flex-col gap-y-2 text-center">
          <h6 className="text-lg font-medium">{title}</h6>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};
