const InputField = ({ name, type, placeholder, defaultValue, error }) => (
    <div className="flex flex-col space-y-1">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full px-6 py-3 border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-md hover:shadow-xl transition duration-300 ease-in-out"
      />
      {error && (
        <div className="text-red-500 text-sm">
          {error.map((err, index) => (
            <p key={index} className="mt-1">{err}</p>
          ))}
        </div>
      )}
    </div>
  );
  
  export default InputField;
  