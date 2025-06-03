import Image from "next/image";
import { useState } from "react";

import { useRouter } from "next/navigation";

const Signout = () => {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignout = async () => {
    setIsLoading(true);

    const res = await fetch("/api/signout", { method: "POST" });

    if (res.ok) {
      router.replace("/login");
    } else {
      console.error("Sign-out failed");
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-row space-x-2 font-light text-lg text-center ">
      <button
        onClick={() => setShowConfirm(true)}
        className="hover:bg-black cursor-pointer rounded px-2 py-1 transition duration-300 flex flex-row"
      >
        <Image src="/assets/exit.png" alt="Sign Out" width={24} height={20} />
        <h1>Sign Out</h1>
      </button>

      {showConfirm && (
        <div
          className={`fixed inset-0 bg-zinc-900/95 flex items-center justify-center z-100 transition-all duration-300 ease-in-out ${showConfirm ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <div className="border border-zinc-400 rounded-2xl bg-zinc-850 ">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="text-white cursor-pointer hover:text-gray-300"
              >
                <p>X</p>
              </button>
            </div>
            <p className="mb-2 p-15">Are you sure you want to sign out?</p>
            <div className="flex justify-center space-x-4 p-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="text-red-600 cursor-pointer hover:text-red-800  font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  handleSignout();
                }}
                className="text-gray-500 cursor-pointer hover:text-gray-700 rounded-md p-2"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading && (
        <div
          className={`fixed inset-0 bg-zinc-900/99 flex items-center justify-center z-100 transition-all duration-300 ease-in-out ${isLoading ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <p className="text-white">Signing out...</p>
        </div>
      )}
    </div>
  );
};

export default Signout;
