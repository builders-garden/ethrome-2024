import { Check, Circle } from "lucide-react";
import Image from "next/image";

interface WelcomeProps {
  name: string;
  weeklyCompleted: number;
  weeklyGoal: number;
}

const Welcome = ({ name, weeklyCompleted, weeklyGoal }: WelcomeProps) => {
  return (
    <div className="min-h-[120px] flex flex-col px-4 py-6 justify-between border rounded-xl bg-[#FF9BB1]">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-medium">
          Welcome, <span className="font-bold">{name}</span>
        </h1>
        <Image
          src="/images/waving-hand.png"
          alt="waving hand"
          width={32}
          height={23}
        />
      </div>
      <div className="flex gap-2 justify-between">
        <p className="text-sm font-bold">Your Weekly Goal</p>
        <div className="flex gap-2">
          {Array.from({ length: weeklyGoal }).map((_, index) => (
            <div key={index} className="flex flex-row gap-2">
              {index < weeklyCompleted ? (
                <Check className="w-6 h-6 text-white bg-primary rounded-full p-1" />
              ) : (
                <Circle className="w-6 h-6 text-white bg-white rounded-full p-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
