interface NotesProps {
  notes: string;
}
const Notes = ({ notes }: NotesProps) => {
  return (
    <div className="flex flex-col">
      <h1>Notes</h1>
      <div className="border rounded-md p-2 bg-zinc-800 shadow-sm">
        <h1 className="text-sm font-light">{notes}</h1>
      </div>
    </div>
  );
};
export default Notes;
