import Image from "next/image";
const notifications = () => {
  return (
    <div>
      <button className="bg-blend-lighten cursor-pointer rounded-md p-2 hover:bg-black  transition-all duration-300">
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
