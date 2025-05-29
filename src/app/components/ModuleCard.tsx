import Image from 'next/image';

interface ModuleCardProps {
  title: string;
  level: string;
  courses: number;
  practices: number;
  image: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  level,
  courses,
  practices,
  image,
}) => {
  return (
    <div className="bg-zinc-800 rounded-xl shadow-md p-4 w-[350px] h-[450px] flex flex-col justify-between">
      <div className="w-full h-90 rounded-md overflow-hidden mb-4 relative">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="text-xs uppercase font-semibold text-zinc-400 mb-1">{level}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>

      <div className="flex text-xs text-zinc-400 gap-4">
        <span>📚 {courses} courses</span>
        <span>🧠 {practices} practices</span>
      </div>
    </div>
  );
};

export default ModuleCard;
