import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import {
  faBell,
  faBookmark,
  faEnvelope,
  faUser,
} from '@fortawesome/free-regular-svg-icons';
import {
  faEllipsis,
  faHouse,
  faListUl,
  faMagnifyingGlass,
  faPeopleArrows,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const LeftSidebar = (props) => {
  let user = useSelector((state) => state);

  return (
    <div className="flex-1 flex justify-end py-4  fixed h-[100vh]  text-white">
      <div className="  text-left relative pr-12">
        <NavLink to="/">
          {' '}
          <FontAwesomeIcon
            icon={faXTwitter}
            style={{ color: '#ffffff' }}
            className="h-8 ml-3 mb-6 hover:scale-105"
          />
        </NavLink>

        <ul className="text-white w-1/3">
          <NavLink to="/home">
            <li className="flex items-center text-2xl mb-3 cursor-pointer w-fit px-3 py-2 rounded-full hover-bg">
              <FontAwesomeIcon
                icon={faHouse}
                style={{ color: '#ffffff' }}
                className="mr-3"
              />
              <p>Accueil</p>
            </li>
          </NavLink>

          {/* <li className="flex items-center text-2xl mb-3 cursor-pointer w-fit px-3 py-2 rounded-full hover-bg">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{ color: '#ffffff' }}
              className="mr-3"
            />
            <p>Explorer</p>
          </li> */}
          {/* <li className="flex items-center text-2xl mb-3 cursor-pointer w-fit px-3 py-2 rounded-full hover-bg">
            <FontAwesomeIcon
              icon={faBell}
              style={{ color: '#ffffff' }}
              className="mr-3"
            />
            <p>Notifications</p>
          </li> */}

          {/* <li className="flex items-center text-2xl mb-3 cursor-pointer w-fit px-3 py-2 rounded-full hover-bg">
            <FontAwesomeIcon
              icon={faListUl}
              style={{ color: '#ffffff' }}
              className="mr-3"
            />
            <p>Listes</p>
          </li> */}
          <NavLink to={'/signets'}>
            <li className="flex items-center text-2xl mb-3 cursor-pointer w-fit px-3 py-2 rounded-full hover-bg">
              <FontAwesomeIcon
                icon={faBookmark}
                style={{ color: '#ffffff' }}
                className="mr-3"
              />
              <p>Signets</p>
            </li>
          </NavLink>

          {/* <li className="flex items-center text-2xl mb-3 cursor-pointer w-fit px-3 py-2 rounded-full hover-bg">
            <FontAwesomeIcon
              icon={faPeopleArrows}
              style={{ color: '#ffffff' }}
              className="mr-3"
            />
            <p>Communautés</p>
          </li> */}
          <NavLink to={`/profil/${user.id}`}>
            {' '}
            <li className="flex items-center text-2xl mb-3 cursor-pointer w-fit px-3 py-2 rounded-full hover-bg">
              <FontAwesomeIcon
                icon={faUser}
                style={{ color: '#ffffff' }}
                className="mr-3"
              />
              <p>Profil</p>
            </li>
          </NavLink>
          <NavLink to="/messages">
            {' '}
            <li className="flex items-center text-2xl mb-3 cursor-pointer w-fit px-3 py-2 rounded-full hover-bg">
              <FontAwesomeIcon
                icon={faEnvelope}
                style={{ color: '#ffffff' }}
                className="mr-3"
              />
              <p>Messages</p>
            </li>
          </NavLink>

          {/* <li className="flex items-center text-2xl mb-3 cursor-pointer w-fit px-3 py-2 rounded-full hover-bg">
            <FontAwesomeIcon
              icon={faXTwitter}
              style={{ color: '#ffffff' }}
              className="mr-3"
            />
            <p>Premium</p>
          </li>
          <li className="flex items-center text-2xl mb-3 cursor-pointer w-fit px-3 py-2 rounded-full hover-bg">
            <FontAwesomeIcon
              icon={faEllipsis}
              style={{ color: '#ffffff' }}
              className="mr-3"
            />
            <p>Plus</p>
          </li> */}
        </ul>
        <button
          className="bg-[#1C9AF0] px-20 text-white text-center py-3 flex text-xl font-bold justify-center rounded-full mb-3"
          onClick={() => props.setTweetInfo({ tweet: null, action: 'post' })}
        >
          <span className="flex items-center">
            <p>Poster</p>
          </span>
        </button>
        <NavLink to={`/profil/${user.id}`}>
          <div className="flex items-center rounded-full  absolute bottom-4 hover-bg px-3 py-2 cursor-pointer">
            <div className="h-12 w-12 rounded-full mr-2">
              <img
                src={user.profil_pic}
                className="h-full w-full rounded-full object-cover"
              />
            </div>

            <span className="mr-12">
              <p className="font-bold">{user.pseudo ? user.pseudo : null}</p>
              <p className="text-slate-500">
                {user.username ? user.username : null}
              </p>
            </span>
            <FontAwesomeIcon
              icon={faEllipsis}
              style={{ color: '#ffffff' }}
              className="mr-3"
            />
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default LeftSidebar;
