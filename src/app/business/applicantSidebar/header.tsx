const SideBarHeader = () => {
  return (
    <div className="flex flex-row item-start justify-between p-2">
      <div>
        <h1 className="text-gray-300">Pull Name here </h1>
        <h1 className="text-bold text-lg text-black">Pull Status here</h1>
      </div>
      <div>
        <h1 className="text-gray-400 border-b-2 pb-1">Pull Position here.</h1>
      </div>
    </div>
  );
};
export default SideBarHeader;
