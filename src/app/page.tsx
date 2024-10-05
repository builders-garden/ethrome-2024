import Hero from "@/components/hero";
import CalendarStreak from "@/components/calendar-streak";
import CustomBarChart from "@/components/charts/custom-bar-chart";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background items-center justify-center">
      <Header />
      <Hero />
      <CalendarStreak />
      <CustomBarChart />
    </div>
  );
}
