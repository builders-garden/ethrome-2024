import { Shield, ShieldAlert } from "lucide-react";

const LeaderboardHero = () => {
  const defaultSize = 55;
  const expandedSize = 70;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center">
        <Shield
          size={defaultSize}
          className="text-orange-900 fill-orange-900"
        />
        <Shield size={defaultSize} className="text-slate-400 fill-slate-400" />
        <Shield
          size={defaultSize}
          className="text-orange-500 fill-orange-500"
        />
        <Shield size={expandedSize} className="text-green-500 fill-green-500" />
        <ShieldAlert size={defaultSize} className="text-slate-400" />
        <ShieldAlert size={defaultSize} className="text-slate-400" />
      </div>

      <h1 className="text-2xl font-bold">Emerald League</h1>

      <div className="flex gap-4 mt-4">
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <p className="text-sm text-green-600 font-semibold">Your Position</p>
          <p className="text-3xl font-bold text-green-700">5th</p>
          <p className="text-xs text-green-500">↑ 2 from yesterday</p>
        </div>

        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <p className="text-sm text-blue-600 font-semibold">Time Left</p>
          <p className="text-3xl font-bold text-blue-700">2d 14h</p>
          <p className="text-xs text-blue-500">League ends Sunday at 20:00</p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardHero;
