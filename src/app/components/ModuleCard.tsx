import Image from 'next/image';

interface ModuleCardProps {
  title: string;
  level: string;
  chapters?: number | unknown[];
  chaptersCount?: number;
  quizzes?: number;
  quizzesCount?: number;
  image: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  level,
  chapters,
  chaptersCount,
  quizzes,
  quizzesCount,
  image,
}) => {
  const numChapters =
    chaptersCount ??
    (typeof chapters === "number"
      ? chapters
      : Array.isArray(chapters)
      ? chapters.length
      : 0);
  const numQuizzes = quizzesCount ?? quizzes ?? 0;

  return (
    <div className="bg-zinc-800 rounded-xl shadow-md p-4 w-[350px] h-[450px] flex flex-col justify-between">
      <div className="w-full h-90 rounded-md overflow-hidden mb-4 relative">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>

      <div className="text-xs uppercase font-semibold text-zinc-400 mb-1">{level}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>

      <div className="flex text-xs text-zinc-400 gap-4">
        <span>📚 {numChapters} courses</span>
        <span>🧠 {numQuizzes} quizzes</span>
      </div>
    </div>
  );
};

export default ModuleCard;
