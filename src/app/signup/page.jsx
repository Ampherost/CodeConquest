'use client';
import { ToastContainer, toast } from 'react-toastify';
import { useState, startTransition, useEffect } from 'react';
import { handleSubmit } from '@/app/signup/actions';
import { useResetableActionState } from 'use-resetable-action-state';
import InputField from '@/app/signup/components/InputField';
import ToggleFormButton from '@/app/signup/components/ToggleFormButton';
import SubmitButton from '@/app/signup/components/SubmitButton';
import { UserType } from '@/app/signup/lib/userType'; 

export default function SignUp() {
  const [userType, setUserType] = useState(UserType.CANDIDATE); 
  const [justReset, setJustReset] = useState(false); 
  const [state, formAction, isPending, reset] = useResetableActionState(
    (state, formData) => handleSubmit(state, formData, userType), 
    {}
  );

  // Toggle between business and candidate form
  const toggleForm = (newUserType) => {
    if (newUserType !== userType) {
      setUserType(newUserType);
      setJustReset(true);
      startTransition(() => {
        reset();
      });
      setTimeout(() => setJustReset(false), 100);
    }
  };

  const formFields = userType === UserType.BUSINESS
    ? [
        { name: 'business_name', type: 'text', placeholder: 'Business Name' },
        { name: 'business_email', type: 'email', placeholder: 'Business Email' },
      ]
    : [
        { name: 'first_name', type: 'text', placeholder: 'First Name' },
        { name: 'last_name', type: 'text', placeholder: 'Last Name' },
        { name: 'email', type: 'email', placeholder: 'Email' },
      ];

  useEffect(() => {
    if (state?.message) {
      toast.dismiss(); 
      toast.error(state.message); 
    }

    if (state?.success) {
      toast.dismiss(); 
      toast.success('SUCCESS! CHECK YOUR EMAIL!'); 
    }
  }, [state?.message, state?.success]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-16 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 text-center">
      <form
        action={formAction}
        className="bg-white dark:bg-zinc-800 p-8 rounded-3xl shadow-lg w-full max-w-md space-y-6 transform hover:scale-105 transition-all duration-300"
      >
        <h2 className="text-4xl font-bold sm:text-5xl tracking-tight text-zinc-900 dark:text-zinc-100 mb-6 text-center mx-auto transform space-y-2">
          {userType === UserType.BUSINESS ? 'Business Sign Up' : 'Candidate Sign Up'}
        </h2>

        {/* Conditional Form Fields */}
        {formFields.map(({ name, type, placeholder }) => (
          <InputField
            key={name}
            name={name}
            type={type}
            placeholder={placeholder}
            defaultValue={state?.default_values?.[name] || ''}
            error={state?.errors?.[name] || []}
          />
        ))}

        <InputField
          name="password"
          type="password"
          placeholder="Password"
          defaultValue={state?.default_values?.password || ''}
          error={state?.errors?.password || []}
        />
        <InputField
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          defaultValue={state?.default_values?.confirm_password || ''}
          error={state?.errors?.confirm_password || []}
        />

        <ToggleFormButton userType={userType} toggleForm={toggleForm} />

        <SubmitButton isPending={isPending} justReset={justReset} />
      </form>

      <ToastContainer />
    </div>
  );
}