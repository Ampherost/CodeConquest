import Image from "next/image";
const profile = () => {
  return (
    <div className="flex items-center justify-center p-1 space-x-2 ">
      <button className="flex flex-row space-x-2 hover:bg-black cursor-pointer p-2 rounded-md transition-all duration-300">
        <Image src="/assets/profile.png" alt="Profile" width={24} height={15} />
        <h1 className="text-white">Profile</h1>
      </button>
    </div>
  );
};
export default profile;
