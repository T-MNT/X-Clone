import React from 'react';
import RegisterBox from './RegisterBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import LoginBox from './LoginBox';

const AuthBox = (props) => {
  return (
    <div className="relative min-h-[600px]  w-[600px]  bg-black rounded-2xl px-12 pt-4 pb-8">
      <FontAwesomeIcon
        icon={faX}
        className="absolute top-5 left-5 cursor-pointer"
        onClick={() => props.setAuthBoxState('')}
      />
      {props.authBoxState === 'register' ? (
        <RegisterBox />
      ) : (
        <LoginBox setAuthBoxState={props.setAuthBoxState} />
      )}
    </div>
  );
};

export default AuthBox;
