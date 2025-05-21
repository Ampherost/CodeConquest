import Image from "next/image";
const signout = () => {
  return (
    <div className="flex flex-row space-x-2 font-light text-lg text-center">
      <button>
        <Image src="/assets/exit.png" alt="Sign Out" width={24} height={20} />
      </button>
      <button>
        <h1>Sign Out</h1>
      </button>
    </div>
  );
};
export default signout;
