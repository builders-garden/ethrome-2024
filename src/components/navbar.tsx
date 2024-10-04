"use client";

import { usePrivy } from "@privy-io/react-auth";

const Navbar = () => {
  const { authenticated, login, logout, user } = usePrivy();

  return (
    <nav className="flex justify-between items-center p-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">NAAAMOFIT</h1>
      </div>
      <div className="flex items-center gap-2">
        {authenticated && user ? (
          <>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">
                {`${user.wallet?.address.slice(
                  0,
                  6
                )} ...${user.wallet?.address.slice(-4)}`}
              </p>
            </div>

            <button
              onClick={logout}
              className="bg-red-500 text-white px-2 py-1 rounded-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={login}
              className="bg-blue-500 text-white px-2 py-1 rounded-md"
            >
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
