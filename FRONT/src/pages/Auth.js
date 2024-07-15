import {
  faApple,
  faGoogle,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import AuthBox from '../components/auth/AuthBox';

const Auth = () => {
  ///Ce state stocke ce qu'il faut afficher dans AuthBox ( inscription ou connexion )
  const [authBoxState, setAuthBoxState] = useState('');

  return (
    <div className="relative bg-black h-[100vh] w-[100vw] text-white">
      {authBoxState === 'login' || authBoxState === 'register' ? (
        <div>
          <div className="h-screen w-screen absolute top-0 left-0 bg-white opacity-20" />
          <div className="w-fit h-fit absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]">
            <AuthBox
              setAuthBoxState={setAuthBoxState}
              authBoxState={authBoxState}
            />
          </div>
        </div>
      ) : null}

      <div className="h-[90vh] grid grid-cols-2">
        <div className="flex items-center justify-center">
          <FontAwesomeIcon
            icon={faXTwitter}
            style={{ color: '#ffffff' }}
            className="h-96"
          />
        </div>
        <div className="flex items-center pl-24">
          <div className="text-left">
            <span>
              <p className="text-7xl font-bold mb-8">
                Ça se passe <br />
                maintenant
              </p>
              <br />
              <p className="text-4xl font-bold mb-16">Inscrivez-vous.</p>
            </span>
            <div className="text-slate-900 text-lg max-w-80">
              <button className="bg-slate-100 w-80 text-center py-1 flex  font-bold justify-center rounded-full mb-2">
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                  <p>S'inscrire avec Google</p>
                </span>
              </button>
              <button className="bg-slate-100 w-80 text-center py-1 flex  font-bold justify-center rounded-full mb-2">
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faApple} className="mr-2" />
                  <p>S'inscrire avec Apple</p>
                </span>
              </button>
              <span className="flex items-center mb-2">
                <div className="h-[1px] bg-slate-700 w-full" />
                <p className="mx-2 text-slate-200">ou</p>
                <div className="h-[1px] bg-slate-700 w-full" />
              </span>
              <button
                className="bg-[#1C9AF0] w-80 text-white text-center py-1 flex  font-bold justify-center rounded-full mb-2"
                onClick={() => setAuthBoxState('register')}
              >
                <span className="flex items-center">
                  <p>Créer un compte</p>
                </span>
              </button>
              <p className="text-slate-100 text-xs mb-8">
                En vous inscrivant, vous acceptez les{' '}
                <a className="text-blue-500">Conditions d'utilisation</a> et la{' '}
                <a className="text-blue-500">Politique de confidentialité</a>,
                notamment l'
                <a className="text-blue-500">Utilisation des cookies</a>.
              </p>
              <p className="text-slate-100 font-bold mb-4">
                Vous avez déjà un compte ?
              </p>
              <button
                className="text-[#1C9AF0] border-[1px] border-slate-500 w-80 text-white text-center py-1 flex  font-bold justify-center rounded-full mb-2"
                onClick={() => setAuthBoxState('login')}
              >
                <span className="flex items-center">
                  <p>Se connecter</p>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[10vh]">
        <ul className="text-slate-600 text-sm flex w-full px-10 justify-between">
          <li>Politique de confidentialité</li>
          <li>Politique de confidentialité</li>
          <li>Politique de confidentialité</li>
          <li>Politique de confidentialité</li>
          <li>Politique de confidentialité</li>
          <li>Politique de confidentialité</li>
          <li>Politique de confidentialité</li>
          <li>Politique de confidentialité</li>
          <li>Politique de confidentialité</li>
          <li>Politique de confidentialité</li>
          <li>Politique de confidentialité</li>
          <li>Politique de confidentialité</li>
        </ul>
      </div>
    </div>
  );
};

export default Auth;
