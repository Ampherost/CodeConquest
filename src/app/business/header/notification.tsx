import Image from "next/image";
const notifications = () => {
  return (
    <div>
      <button className="bg-blend-lighten rounded-md p-2">
        <Image
          src={"/assets/notification.png"}
          alt="Notification Icon"
          height={30}
          width={30}
        />
      </button>
    </div>
  );
};

export default notifications;
