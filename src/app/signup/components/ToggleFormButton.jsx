import { UserType } from '@/app/signup/lib/userType';  


const ToggleFormButton = ({ userType, toggleForm }) => (
    <div className="flex justify-center items-center space-x-6 mt-6">
      <button
        type="button"
        onClick={() => toggleForm(UserType.CANDIDATE)}
        className={`px-8 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform ${
          userType !== UserType.BUSINESS
            ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105'
            : 'bg-zinc-500 text-zinc-300 hover:bg-zinc-600'
        }`}
      >
        Candidate
      </button>
      <button
        type="button"
        onClick={() => toggleForm(UserType.BUSINESS)}
        className={`px-8 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out transform ${
          userType === UserType.BUSINESS
            ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105'
            : 'bg-zinc-500 text-zinc-300 hover:bg-zinc-600'
        }`}
      >
        Business
      </button>
    </div>
  );
  
  export default ToggleFormButton;
  