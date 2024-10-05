import Welcome from "@/components/user/welcome";
import CalendarStreak from "@/components/calendar-streak";
import CustomBarChart from "@/components/charts/custom-bar-chart";

export default function Home() {
  return (
    <div className="flex-grow overflow-y-auto">
      <div className="items-center max-w-sm lg:max-w-md bg-background rounded-xl p-2 mx-auto">
        <Welcome name="John Doe" weeklyCompleted={2} weeklyGoal={4} />
        <CalendarStreak />
        <CustomBarChart />
        <div className="flex flex-col items-center justify-center">
          Eu laboris sunt fugiat quis Lorem proident non officia voluptate sunt
          id veniam consequat voluptate quis. Ea magna nulla duis id esse nisi
          qui nostrud. Reprehenderit dolore aliqua nostrud ut sint esse fugiat
          exercitation qui enim. Magna minim sunt enim. Nulla ad ea deserunt
          laborum officia aliquip. Lorem id laborum aliquip consequat veniam
          officia. Enim voluptate id esse et veniam laborum sit dolore labore.
        </div>
      </div>
    </div>
  );
}
