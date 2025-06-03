import MCQ, { FRQ } from "./Option";

export default function Question({
  type,
  title,
  options = [],
  onAnswer,
  description,
  hints,
}) {
  let QuestionComponent;
  const normalizedType = (type || "").toLowerCase().trim();
  console.log("Raw type:", type);
  console.log("Normalized type:", normalizedType);
  console.log("Normalized type:", normalizedType);

  switch (normalizedType) {
    case "mcq":
      QuestionComponent = (
        <MCQ title={title} options={options} onAnswer={onAnswer} />
      );
      break;
    case "frq":
      QuestionComponent = (
        <FRQ
          title={title}
          onAnswer={onAnswer}
          description={description}
          hints={hints}
        />
      );
      break;
    default:
      QuestionComponent = (
        <MCQ title={title} options={options} onAnswer={onAnswer} />
      );
  }

  return <div>{QuestionComponent}</div>;
}
