"use client";
// import Hero from "@/components/hero";
// import Fluid from "@/components/fluid";
// import CalendarStreak from "@/components/calendar-streak";
// import CustomBarChart from "@/components/charts/custom-bar-chart";
import Header from "@/components/header";
import SponsorsDesktop from "@/components/sponsors-desktop";
import SponsorsMobile from "@/components/sponsors-mobile";
import { streamsDetailsQuery } from "@/lib/queries";
import { useQuery } from "@apollo/client";

export default function Home() {
  const { loading, error, data } = useQuery(streamsDetailsQuery, {
    variables: { receiver: "0xaf491be3402245400a537f84c09513cd9c371a50" },
    fetchPolicy: "network-only",
  });

  console.log("subgraph", loading, error, data);

  return (
    <div className="flex min-h-screen flex-col items-center">
      <Header />

      {/* Big Slider */}
      {/* <BackgroundGradientAnimation containerClassName="h-96"> */}
      <div
        className={
          "bg-center bg-cover h-96 w-screen relative overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]"
        }
        style={{ backgroundImage: "url('/images/user-placeholder.png')" }}
      >
        {/* Add semi-transparent overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Text content */}
        <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
          <p className="bg-clip-text drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
            Crypto Gyms are here
          </p>
        </div>
      </div>
      {/* </BackgroundGradientAnimation> */}

      {/* Sponsors Row */}
      <div className="flex flex-col items-center justify-center gap-6 py-5">
        <div className="hidden sm:block">
          <SponsorsDesktop />
        </div>
        <div className="block sm:hidden">
          <SponsorsMobile />
        </div>
      </div>

      {/* Project Explanation */}
      <div className="w-full py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              About NaaamoFit
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Revolutionizing the Industry
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Add more feature items as needed */}
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    {/* Add icon here */}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Feature 1
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    {/* Add icon here */}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    Feature 2
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
