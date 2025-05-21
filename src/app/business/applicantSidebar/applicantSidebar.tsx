import AssignedTask from "./assignedTask";
import AvailableTask from "./availableTasks";
import SideBarHeader from "./header";
import Notes from "./notes";

const ApplicantSidebar = () => {
  return (
    <div>
      <SideBarHeader />
      <AssignedTask />
      <AvailableTask />
      <Notes />
    </div>
  );
};

export default ApplicantSidebar;
