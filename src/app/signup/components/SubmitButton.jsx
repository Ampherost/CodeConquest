const SubmitButton = ({ isPending, justReset }) => (
    <button
      type="submit"
      disabled={isPending && !justReset}
      className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
        isPending && !justReset
          ? 'bg-blue-300 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 shadow-xl transform hover:scale-105'
      }`}
    >
      {isPending && !justReset ? 'Pending...' : 'Submit'}
    </button>
  );
  
  export default SubmitButton;
  