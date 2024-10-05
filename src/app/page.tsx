import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Fluid from "@/components/fluid";

export default function Home() {
  return (
    <div className="w-full h-full">
      <Navbar />
      <Hero />
      <Fluid />
    </div>
  );
}
