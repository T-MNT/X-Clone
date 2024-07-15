import React, { useEffect, useState, useRef } from 'react';
import defaultPp from '../assets/img/goku_sticker.png';
import { formatDate } from '../utils/tweetFunctions';
import { NavLink } from 'react-router-dom';
import ClockLoader from 'react-spinners/ClockLoader';

const FollowsDisplayer = (props) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (props.autoClose) {
      timeoutRef.current = setTimeout(() => {
        props.setFollowsDisplayer({ active: false, type: null });
      }, 500);
    } else {
      clearTimeout(timeoutRef.current);
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [props.autoClose, props]);

  return (
    <div
      onMouseEnter={() => props.setAutoClose(false)}
      onMouseLeave={() => props.setAutoClose(true)}
      className="absolute left-2 z-50  max-h-[300px] rounded w-fit text-white bg-black text-left"
      style={{ boxShadow: '0 0 15px 5px rgba(255, 255, 255, 0.4)' }}
    >
      <span className="flex items-center justify-between border-b-[1px] border-slate-700 p-2">
        {' '}
        {props.type === 'followings' ? (
          <p className="font-bold ">Abonnements</p>
        ) : (
          <p className="font-bold">Abonnés</p>
        )}{' '}
        {props.autoClose ? (
          <ClockLoader
            color={'#1C9AF0'}
            size={18}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : null}
      </span>

      <ul>
        {props.follows.map((follow) => (
          <NavLink key={follow.user.id} to={`/profil/${follow.user.id}`}>
            <li className="flex  items-center px-2 py-2 border-b-[1px] border-slate-700 hover-bg cursor-pointer">
              <img
                src={
                  follow.user.profil_pic ? follow.user.profil_pic : defaultPp
                }
                className="h-12 min-w-12 max-w-12 rounded-full object-cover"
              />
              <span className="pl-2">
                <span className="flex items-center">
                  <p className="font-bold text-lg mr-2">{follow.user.pseudo}</p>
                  <p className="text-slate-500">{follow.user.username}</p>
                </span>
                <p className="text-xs text-left text-slate-500 overflow-hidden inline-block">
                  Abonné depuis le {formatDate(follow.date.split(' ')[0])}
                </p>
              </span>
            </li>
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export default FollowsDisplayer;
