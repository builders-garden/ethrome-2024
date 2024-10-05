import LeaderboardHero from "@/components/user/leaderboard-hero";
import LeaderboardTable from "@/components/user/leaderboard-table";

export default function UserLeaderboard() {
  return (
    <div className="min-h-screen w-full">
      <LeaderboardHero />
      <LeaderboardTable />
    </div>
  );
}
