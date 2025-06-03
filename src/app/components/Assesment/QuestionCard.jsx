import MCQ, { FRQ } from "./Option";

export default function Question({ type, title, options = [], onAnswer, description, hints, initialAnswer, disabled })
 {
  let QuestionComponent;

  switch (type) {
    case "mcq":
      QuestionComponent = (
        <MCQ
          title={title}
          options={options}
          onAnswer={onAnswer}
          initialAnswer={initialAnswer}
          reviewMode={disabled} 
        />
      );
      break;
    case "frq":
      QuestionComponent = (
        <FRQ
          title={title}
          onAnswer={onAnswer}
          description={description}
          hints={hints}
          initialAnswer={initialAnswer}
          reviewMode={disabled}  
        />
      );
      break;
    default:
      QuestionComponent = <div>Unsupported question type: {type}</div>;
  }

  return <div>{QuestionComponent}</div>;
}
