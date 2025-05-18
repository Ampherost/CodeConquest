import Welcome from "./header/welcome";
import Invitation from "./header/sendInvitationButton";
import LogoComponent from "./header/logoComponent";
import Notifications from "./header/notification";
import Signout from "./header/signOut";
import Profile from "./header/userProfile";
const Component = () => {
  return (
    //main page
    <div className="bg-black">
      <div
        id="header"
        className="flex flex-row justify-between items-start w-full
        px-15 py-4"
      >
        <div className="flex flex-row items-center space-x-4">
          <LogoComponent />
          <Welcome />
        </div>
        <div className="flex flex-row items-center space-x-4">
          <Profile />
          <Notifications />
          <Invitation />
          <Signout />
        </div>
      </div>
    </div>
  );
};

export default Component;
