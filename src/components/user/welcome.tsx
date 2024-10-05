import { Check, Circle } from "lucide-react";
import Image from "next/image";

interface WelcomeProps {
  name: string;
  weeklyCompleted: number;
  weeklyGoal: number;
}

const Welcome = ({ name, weeklyCompleted, weeklyGoal }: WelcomeProps) => {
  return (
    <div className="flex flex-col p-4 justify-between rounded-xl bg-red-200 gap-4">
      <div className="flex w-full items-center font-[Rengita] justify-between">
        <div className="flex flex-col items-start gap-1">
          <span className="text-3xl">
            Welcome
          </span>
          <div className="flex gap-1">
            <span className="font-thin">{name}</span>
            <Image
              src="/images/waving-hand.png"
              alt="waving hand"
              width={32/2}
              height={23/2}
            />
          </div>
        </div>
        <Image
          src="/images/user-placeholder.png"
          alt="user"
          width={60}
          height={60}
          className="rounded-xl border-2 border-red-100"
        />
      </div>
      <div className="flex gap-2 justify-between items-center">
        <span className="text-sm font-bold">Your Weekly Goal</span>
        <div className="flex gap-2">
          {Array.from({ length: weeklyGoal }).map((_, index) => (
            <div key={index} className="flex flex-row gap-2">
              {index < weeklyCompleted ? (
                <Check className="w-6 h-6 text-white bg-red-500 rounded-full p-1" />
              ) : (
                <Circle className="w-6 h-6 text-red-50 bg-red-50 rounded-full p-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
