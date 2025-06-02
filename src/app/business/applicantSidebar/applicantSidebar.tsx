import AssignedTask from "./assignedTask";
import AvailableTask from "./availableTasks";
import SideBarHeader from "./header";
import Notes from "./notes";
import defaultProfilePic from "../../../../public/assets/defaultProfile.png";
import expand from "../../../../public/assets/expand.png";

import Image from "next/image";

interface ApplicantSidebarProps {
  businessUserId: string;
  setSidebarOpen?: (open: boolean) => void;
  sidebarCollapse?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ApplicantSidebar = ({
  businessUserId,
  setSidebarOpen,
  sidebarCollapse,
}: ApplicantSidebarProps) => {
  return (
    <div className={`${sidebarCollapse ? "" : ""}  `}>
      <div className="flex justify-between p-5">
        <button
          onClick={() => sidebarCollapse?.((prev) => !prev)}
          className="text-white text-xl hover:text-gray-400 transition-colors cursor-pointer"
        >
          <Image
            src={expand}
            alt="Expand Sidebar"
            width={30}
            height={24}
            className="transform transition-transform duration-300"
          />
        </button>
        <button
          className="text-white text-xl hover:text-gray-500 transition-colors cursor-pointer"
          onClick={() => setSidebarOpen?.(false)}
        >
          X
        </button>
      </div>
      <div className="flex p-5 space-x-2 mb-10">
        <Image
          src={defaultProfilePic}
          alt="Profile"
          width={300}
          height={15}
          className="rounded-full"
        />
      </div>
      <div className="p-5 space-y-4">
        <h1 className="text-white">Profile</h1>
        <SideBarHeader business_user_id={businessUserId} />
        <AssignedTask business_user_id={businessUserId} />
        <AvailableTask business_user_id={businessUserId} />
        <Notes business_user_id={businessUserId} />
      </div>
    </div>
  );
};

export default ApplicantSidebar;
