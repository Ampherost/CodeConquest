"use client";

import Header from "@/app/components/Header";
import Welcome from "./welcome";
import Invitation from "./sendInvitationButton";
import Notifications from "./notification";
import Signout from "./signOut";
import Profile from "./userProfile";

interface BusinessHeaderProps {
  businessUserId: string;
  onInviteSuccess: (code: string) => void;
}

const BusinessHeader: React.FC<BusinessHeaderProps> = ({
  businessUserId,
  onInviteSuccess,
}) => {
  const leftNode = <Welcome />;

  const rightActions = (
    <div className="flex flex-row items-center space-x-4">
      <Profile />
      <Notifications />
      <Invitation
        business_user_id={businessUserId}
        onSuccess={onInviteSuccess}
      />
      <Signout />
    </div>
  );

  return (
    <Header
      initialRole="business"
      leftNode={leftNode}
      rightActions={rightActions}
    />
  );
};

export default BusinessHeader;
