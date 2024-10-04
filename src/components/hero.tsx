"use client";

import usePimlico from "@/hooks/use-pimlico";
import { useLogin } from "@privy-io/react-auth";
// import { useRouter } from "next/navigation";

const Hero = () => {
  // const router = useRouter();
  const { predictSmartAccountAddress } = usePimlico();
  const { login } = useLogin({
    onComplete: async (user, isNewUser) => {
      const smartAccountAddress = await predictSmartAccountAddress();
      console.log("smartAccountAddress", smartAccountAddress);
      if (isNewUser) {
        // await fetch("/api/users", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     email: user.email?.address,
        //     address: user.wallet?.address,
        //     smartAccountAddress,
        //   }),
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });
      }
      // router.push("/dashboard"); // cazzo
    },
  });

  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col gap-6 items-center text-center max-w-3xl px-4">
        <h1 className="text-5xl font-bold text-blue-600">NAAAMOFIT</h1>
        <p className="text-xl text-white">
          Streamline your gym management and boost member engagement with our
          all-in-one platform
        </p>
        <div className="bg-white text-black p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">For Gym Owners</h2>
          <ul className="text-left text-gray-600 mb-4">
            <li>✓ Effortless member management</li>
            <li>✓ Automated billing and payments</li>
            <li>✓ Class scheduling and attendance tracking</li>
            <li>✓ Performance analytics and reporting</li>
          </ul>
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition duration-300"
            onClick={() => login()}
          >
            Get started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
