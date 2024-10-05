import Welcome from "@/components/user/welcome";
import CalendarStreak from "@/components/calendar-streak";
import CustomBarChart from "@/components/charts/custom-bar-chart";

export default function Home() {
  const cashback = 2;
  return (
    <div className="w-full min-h-screen">
      <Welcome name="John Doe" weeklyCompleted={2} weeklyGoal={4} />
      <div className="bg-white rounded-xl shadow-md p-4 flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-700">Your cashback</h2>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-500">Available balance</span>
          <span className="text-4xl font-bold text-green-600">
            ${(cashback * 0.15).toFixed(2)}
          </span>
        </div>
      </div>
      <CalendarStreak />
      <CustomBarChart />
      <div className="flex flex-col items-center justify-center">
        Eu laboris sunt fugiat quis Lorem proident non officia voluptate sunt id
        veniam consequat voluptate quis. Ea magna nulla duis id esse nisi qui
        nostrud. Reprehenderit dolore aliqua nostrud ut sint esse fugiat
        exercitation qui enim. Magna minim sunt enim. Nulla ad ea deserunt
        laborum officia aliquip. Lorem id laborum aliquip consequat veniam
        officia. Enim voluptate id esse et veniam laborum sit dolore labore.
      </div>
    </div>
  );
}
