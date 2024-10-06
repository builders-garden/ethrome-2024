import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ChallengeCardProps {
  name: string;
  author: string;
  type: string;
  progress: number;
}

const ChallengeCard = ({
  name,
  author,
  type,
  progress,
}: ChallengeCardProps) => {
  return (
    <div className="rounded-lg bg-red-200 p-4 relative">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{name}</h2>
          <p className="text-md text-gray-600">Created by {author}</p>
        </div>
        <Badge
          variant="default"
          className="absolute top-4 right-4 text-md font-bold"
        >
          {type}
        </Badge>
      </div>
      <Progress value={progress} className="w-full mt-4" />
    </div>
  );
};

export default ChallengeCard;
