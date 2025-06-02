interface AssignedTaskProps {
  business_user_id: string;
}

const AssignedTask = ({ business_user_id }: AssignedTaskProps) => {
  return (
    <div>
      <div>
        <h1 className="font-bold text-2xl">Assigned Task</h1>
        <div
          id="Assigned Tasks"
          className="flex flex-row justify-between items-start p-2"
        >
          <h2>Pull Quizes here. </h2>
          <button>
            <h1>Alternate Status Button</h1>
          </button>
        </div>
      </div>
    </div>
  );
};
export default AssignedTask;
