import MCQ, { FRQ } from "./Option";


export default function Question({ type, title, options = [], onAnswer, description, hints }) {
  let QuestionComponent;

  switch (type) 
  {
    case "mcq":
      QuestionComponent = <MCQ title = {title} options={options} onAnswer={onAnswer} />;
      break;
    case "frq":
      QuestionComponent = <FRQ title = {title} onAnswer={onAnswer} description={description} hints={hints} />;
      break;
    default:
      QuestionComponent = <div>Unsupported question type: {type}</div>;
  }

  return (
    <div className="">
      {QuestionComponent}
    </div>
  );
}