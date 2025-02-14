//app/auth/page   -  to jest dobrze

"use client"
import { useState } from 'react';
import Image from 'next/image';
import { LoginForm } from '../../components/authentication/LoginForm';
import { RegisterForm } from '../../components/authentication/RegisterForm';
import { ResetForm } from '../../components/authentication/ResetForm';


export default function AuthPage() {
  const [formType, setFormType] = useState('login'); // 'login', 'register', 'reset'


  
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/auth.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      <div className="flex flex-col gap-4 h-screen">
        <div className="flex justify-center items-center h-full">
        
        <div className="flex flex-1 items-center justify-center w-full max-w-md p-5 border border-gray-300 shadow-lg rounded-lg mx-auto my-auto">
         
        {formType === 'login' && (
          <>
            <div className="w-full max-w-xs mx-auto"> {/* Dodanie klasy mx-auto w celu wyśrodkowania */}
              <LoginForm />
              <div className="flex flex-col items-center mt-4"> {/* Flexbox do wyśrodkowania */}
                <br />
                <button 
                  onClick={() => setFormType('register')} 
                  className="underline underline-offset-4 text-center">
                  Nie masz konta? Zarejestruj się
                </button>
                <br />
                <button 
                  onClick={() => setFormType('reset')} 
                  className="underline underline-offset-4 text-center">
                  Zapomniałeś hasła?
                  <br />
                </button>
              </div>
            </div>
          </>
        )}
          {formType === 'register' && (
            <>
              <div className="w-full max-w-xs mx-auto">
                <RegisterForm />
                <div className="flex flex-col items-center mt-4">
                <br />
                <button onClick={() => setFormType('login')} className="underline underline-offset-4">
                Pamiętasz hasło? Zaloguj się
                <br />
                </button>
              </div>
              </div>
            </>
          )}
          {formType === 'reset' && (
            <>
             <div className="w-full max-w-xs mx-auto">
              <ResetForm />
              <div className="flex flex-col items-center mt-4">
              <br />
                <button onClick={() => setFormType('login')} className="underline underline-offset-4">
                Pamiętasz hasło? Zaloguj się
                </button>
              </div>
              </div>
            </>
          )}
        </div>
        </div>
       </div>
       
    </div>
    );
} 

// 'use client'
// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { LoginForm } from '@/components/authentication/LoginForm';
// import { RegisterForm } from '@/components/authentication/RegisterForm';
// import { ResetForm } from '@/components/authentication/ResetForm';
// import { useSearchParams } from 'next/navigation';

// export default function AuthPage() {
//   const [formType, setFormType] = useState('login');
//   const searchParams = useSearchParams();
//   const errorMessage = searchParams.get('error');

//   useEffect(() => {
//     if (errorMessage) {
//       console.error('Błąd logowania:', errorMessage);
//       // Tutaj możesz dodatkowo wyświetlić komunikat błędu w bardziej widoczny sposób w UI
//     }
//   }, [errorMessage]);

//   return (
//     <div className="grid min-h-svh lg:grid-cols-2">
//       <div className="relative hidden bg-muted lg:block">
//         <img
//           src="/authstyle.png"
//           alt="Image"
//           className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
//         />
//       </div>

//       <div className="flex flex-col gap-4 h-screen">
//         <div className="flex justify-center items-center h-full">
//           <div className="flex flex-1 items-center justify-center w-full max-w-md p-5 border border-gray-300 shadow-lg rounded-lg mx-auto my-auto">
//             {errorMessage && (
//               <div className="text-red-500 mb-4">
//                 {decodeURIComponent(errorMessage)}
//               </div>
//             )}
//             {formType === 'login' && (
//               <>
//                 <div className="w-full max-w-xs mx-auto">
//                   <LoginForm />
//                   <div className="flex flex-col items-center mt-4">
//                     <br />
//                     <button
//                       onClick={() => setFormType('register')}
//                       className="underline underline-offset-4 text-center"
//                     >
//                       Nie masz konta? Zarejestruj się
//                     </button>
//                     <br />
//                     <button
//                       onClick={() => setFormType('reset')}
//                       className="underline underline-offset-4 text-center"
//                     >
//                       Zapomniałeś hasła?
//                       <br />
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//             {formType === 'register' && (
//               <>
//                 <div className="w-full max-w-xs mx-auto">
//                   <RegisterForm />
//                   <div className="flex flex-col items-center mt-4">
//                     <br />
//                     <button
//                       onClick={() => setFormType('login')}
//                       className="underline underline-offset-4"
//                     >
//                       Pamiętasz hasło? Zaloguj się
//                       <br />
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//             {formType === 'reset' && (
//               <>
//                 <div className="w-full max-w-xs mx-auto">
//                   <ResetForm />
//                   <div className="flex flex-col items-center mt-4">
//                     <br />
//                     <button
//                       onClick={() => setFormType('login')}
//                       className="underline underline-offset-4"
//                     >
//                       Pamiętasz hasło? Zaloguj się
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }