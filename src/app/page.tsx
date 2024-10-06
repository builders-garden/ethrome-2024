"use client";
// import Hero from "@/components/hero";
// import Fluid from "@/components/fluid";
// import CalendarStreak from "@/components/calendar-streak";
// import CustomBarChart from "@/components/charts/custom-bar-chart";
import { Header } from "@/components/header";
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
      <div className="w-full py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            Sponsor Bounties
          </h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-3">
            {/* Replace with actual sponsor images */}
            {/* {[1, 2, 3, 4, 5].map((sponsor) => ( */}
            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
              {/* <img
                  src={`/placeholder-sponsor-${sponsor}.png`}
                  alt={`Sponsor ${sponsor}`}
                  width={158}
                  height={48}
                /> */}
              <svg
                className="logo-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 167 40"
                width="210"
                height="50"
              >
                <g fill-rule="evenodd">
                  <path d="M62.415 22.066v-7.642h3.725v7.946c0 .791.243 1.425.73 1.904.488.478 1.109.717 1.863.717.735 0 1.342-.244 1.82-.731.479-.488.718-1.118.718-1.89v-7.946h3.724v7.642c0 1.876-.593 3.403-1.78 4.58-1.186 1.177-2.68 1.766-4.482 1.766-1.84 0-3.352-.584-4.538-1.753-1.187-1.167-1.78-2.698-1.78-4.593M87.324 21.266c0-1.121-.33-2.032-.993-2.731-.662-.698-1.508-1.048-2.538-1.048-.993 0-1.817.331-2.47.993-.652.662-.979 1.582-.979 2.759 0 1.177.327 2.101.98 2.772.652.672 1.476 1.007 2.47 1.007 1.01 0 1.852-.349 2.523-1.048.672-.7 1.007-1.6 1.007-2.704Zm1.89-5.117c1.26 1.352 1.89 3.048 1.89 5.09 0 2.041-.63 3.747-1.89 5.117-1.26 1.37-2.837 2.056-4.731 2.056-1.711 0-3.072-.552-4.084-1.656v6.29h-3.724V14.424h3.421v1.711c.938-1.343 2.4-2.014 4.386-2.014 1.895 0 3.472.676 4.732 2.028ZM96.205 19.887h6.208c-.019-.828-.309-1.495-.87-2-.561-.506-1.255-.759-2.082-.759-.791 0-1.481.248-2.07.745-.589.496-.984 1.168-1.186 2.014Zm9.573 2.62h-9.573c.22.865.666 1.532 1.338 2 .67.47 1.504.705 2.497.705 1.342 0 2.611-.46 3.807-1.38l1.545 2.538c-1.637 1.361-3.458 2.042-5.463 2.042-2.097.036-3.876-.649-5.338-2.056-1.462-1.407-2.175-3.104-2.138-5.09-.037-1.968.653-3.66 2.07-5.076 1.415-1.416 3.107-2.106 5.076-2.069 1.876 0 3.416.607 4.62 1.82 1.205 1.215 1.807 2.723 1.807 4.526 0 .661-.083 1.342-.248 2.04ZM116.036 14.424v3.284h-.993c-1.141 0-2.038.303-2.69.91-.654.607-.98 1.49-.98 2.648v6.815h-3.724V14.424h3.421v1.628c.956-1.195 2.207-1.793 3.752-1.793.46 0 .865.055 1.214.165M126.597 28.08h3.725V7.059h-3.725v21.023ZM124.82 7.059v3.339h-.897c-.864 0-1.495.165-1.89.496-.395.33-.593.874-.593 1.628v1.903h3.38v3.145h-3.38v10.512h-3.725V12.19c0-1.692.46-2.97 1.38-3.835.92-.864 2.216-1.297 3.89-1.297h1.835ZM132.136 22.066v-7.642h3.725v7.946c0 .791.243 1.425.73 1.904.488.478 1.109.717 1.863.717.736 0 1.343-.244 1.82-.731.48-.488.718-1.118.718-1.89v-7.946h3.724v7.642c0 1.876-.592 3.403-1.78 4.58-1.185 1.177-2.68 1.766-4.482 1.766-1.84 0-3.352-.584-4.538-1.753-1.187-1.167-1.78-2.698-1.78-4.593M146.531 28.081h3.725V14.424h-3.725zM162.019 24.025c.652-.662.979-1.581.979-2.759 0-1.177-.331-2.101-.993-2.772-.663-.672-1.481-1.007-2.456-1.007-1.012 0-1.853.35-2.524 1.048-.672.7-1.007 1.6-1.007 2.704 0 1.122.331 2.032.993 2.73.662.7 1.508 1.05 2.538 1.05.993 0 1.816-.332 2.47-.994Zm.924-16.967h3.724v21.023h-3.42v-1.683c-.939 1.342-2.401 2.014-4.387 2.014-1.914 0-3.495-.676-4.745-2.028-1.252-1.352-1.876-3.058-1.876-5.118 0-2.06.624-3.765 1.876-5.117 1.25-1.352 2.831-2.028 4.745-2.028 1.728 0 3.09.543 4.083 1.628v-8.69ZM56.59 17.624l-2.07-.91c-.81-.367-1.366-.694-1.669-.98-.303-.284-.455-.656-.455-1.116 0-.069.013-.13.02-.194h-3.787c-.004.092-.013.182-.013.276 0 2.19 1.471 3.936 4.415 5.242l1.958.883c.92.423 1.535.777 1.849 1.062.312.285.469.686.469 1.2 0 .626-.23 1.117-.69 1.476-.46.359-1.095.538-1.904.538-1.692 0-3.182-.883-4.47-2.648l-2.565 1.93a7.93 7.93 0 0 0 2.91 2.953c1.224.717 2.599 1.076 4.125 1.076 1.858 0 3.384-.501 4.58-1.504 1.195-1.002 1.793-2.322 1.793-3.959 0-1.214-.359-2.23-1.076-3.048-.717-.819-1.858-1.577-3.42-2.277M61.086 9.006h-5.418v2.709h2.709v2.709h2.709V9.006M150.256 14.424h4.105v-4.106h-4.105zM30.698 23.506h-7.24v-7.24H16.22V9.029h14.479v14.478ZM8.98 30.746h7.24v-7.24H8.98v7.24ZM0 4.383V35.39a4.336 4.336 0 0 0 4.336 4.337h31.005a4.336 4.336 0 0 0 4.337-4.337V4.384A4.336 4.336 0 0 0 35.34.048H4.336A4.336 4.336 0 0 0 0 4.384Z"></path>
                </g>
              </svg>
            </div>
            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
              <img src="/images/privy-logo-light.png" alt={`Sponsor privy`} />
            </div>
            <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1">
              <img src="/images/pimlico-purple.svg" alt={`Sponsor privy`} />
            </div>
            {/* ))} */}
          </div>
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
