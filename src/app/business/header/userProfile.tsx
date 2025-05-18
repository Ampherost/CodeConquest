import Image from "next/image";
const profile = () => {
  return (
    <div className="flex flex-row items-center justify-center p-1 space-x-2">
      <button className="">
        <Image src="/assets/profile.png" alt="Profile" width={24} height={20} />
      </button>
      <button>
        <h1 className="text-white">Profile</h1>
      </button>
    </div>
  );
};
export default profile;
