import {
  faApple,
  faGoogle,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useSelector, useDispatch } from 'react-redux';
import { setUserRedux } from '../../redux/slices/UserSlice';
import { useNavigate } from 'react-router-dom';

const LoginBox = (props) => {
  const [step, setStep] = useState(0);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateCredentials = (attributeName, newValue) => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [attributeName]: newValue,
    }));
  };

  let loginHandler = () => {
    axios.post('https://127.0.0.1:8000/api/login', credentials).then((res) => {
      if (res.status === 200) {
        console.log(res);
        let token = res.data.token;
        let tokenData = jwtDecode(token);
        window.localStorage.setItem('x_user_token', token);
        dispatch(setUserRedux(tokenData));

        return navigate('/home');
      } else if (res.status === 401) {
        alert('Identifiant ou mot de passe incorrect');
      }
    });
  };

  return (
    <div className="text-white text-left">
      <span className="flex justify-center mb-8">
        <FontAwesomeIcon icon={faXTwitter} className="h-8 mx-auto " />
      </span>
      <div className="px-10 w-full text-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-10">Connectez-vous à X</h2>
          <span className="mb-12 ">
            <button className="bg-white flex justify-center  text-black font-bold w-3/4 mx-auto py-1 rounded-full mb-6">
              <span className="flex items-center">
                <FontAwesomeIcon icon={faGoogle} className="mr-2 h-[20px]" />
                <p>Connectez-vous avec Google</p>
              </span>
            </button>
            <button className="bg-white flex justify-center text-black font-bold w-3/4 mx-auto py-1 rounded-full">
              <span className="flex items-center">
                <FontAwesomeIcon icon={faApple} className="mr-2 h-[24px]" />
                <p>Connectez-vous avec Apple</p>
              </span>
            </button>
          </span>

          <span className="w-3/4 mx-auto flex items-center mt-4 mb-2">
            <div className="h-[1px] bg-slate-700 w-full" />
            <p className="mx-2 text-slate-200">ou</p>
            <div className="h-[1px] bg-slate-700 w-full" />
          </span>
          <input
            type="text"
            className="w-3/4 mx-auto border-[1px] text-lg border-slate-700 bg-transparent rounded px-2 py-3 mb-4"
            placeholder="Numéro de téléphone, adresse mail"
            onChange={(e) => updateCredentials('email', e.target.value)}
          />
          {step === 1 ? (
            <input
              type="password"
              className="w-3/4 mx-auto border-[1px] text-lg border-slate-700 bg-transparent rounded px-2 py-3 mb-8"
              placeholder="Mot de passe"
              onChange={(e) => updateCredentials('password', e.target.value)}
            />
          ) : null}
        </div>

        {step === 0 ? (
          <button
            className="bg-white text-black font-bold w-3/4 py-2 mx-auto rounded-full mb-4"
            onClick={() => setStep(1)}
          >
            Suivant
          </button>
        ) : (
          <button
            className="bg-white text-black font-bold w-3/4 py-2 mx-auto rounded-full mb-4"
            onClick={() => loginHandler()}
          >
            Se connecter
          </button>
        )}

        <button className="bg-transparent text-white border-[1px] border-slate-700 font-bold w-3/4 py-2 mx-auto rounded-full mb-12">
          Mot de passe oublié ?
        </button>
        <p className="text-slate-500">
          Vous n'avez pas de compte ?{' '}
          <span
            className="text-[#1C9AF0] cursor-pointer"
            onClick={() => props.setAuthBoxState('register')}
          >
            Inscrivez-vous
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginBox;
