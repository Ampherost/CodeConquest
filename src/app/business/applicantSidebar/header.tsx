interface SideBarHeaderProps {
  name?: string;
  status?: string;
  position?: string;
}
const SideBarHeader = ({ name, status, position }: SideBarHeaderProps) => {
  return (
    <div className="flex flex-row item-start justify-between p-2">
      <div>
        <h1 className="text-gray-300">{name}</h1>
        <h1 className="text-bold text-lg text-black">{status}</h1>
      </div>
      <div>
        <h1 className="text-gray-400 border-b-2 pb-1">{position}</h1>
      </div>
    </div>
  );
};
export default SideBarHeader;
