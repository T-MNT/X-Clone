import { faSearch, faUser, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import defaultPp from '../assets/img/goku_sticker.png';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const NewConvBox = (props) => {
  const user = useSelector((state) => state);
  const [talkedUser, setTalkedUser] = useState(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [lastSearch, setLastSearch] = useState(null);

  useEffect(() => {
    searchUserHandler();
  }, [search]);

  let searchUserHandler = () => {
    if (search != '') {
      let data = {
        search: search,
        type: 'user',
      };

      axios.post('https://127.0.0.1:8000/search', data).then((res) => {
        if (res.status === 200) {
          setSearchResults(res.data);
          setLastSearch(search);
        }
      });
    }
  };

  let createConvHandler = () => {
    let data = {
      user1: user.id,
      user2: talkedUser.id,
    };

    axios
      .post('https://127.0.0.1:8000/conversation/create', data)
      .then((res) => console.log(res));
  };

  return (
    <div className="bg-black text-white w-[600px] py-3 rounded-xl text-left">
      <div className="flex justify-between items-center px-4 mb-4">
        <span className="flex items-center">
          <FontAwesomeIcon
            icon={faX}
            className="mr-12 cursor-pointer"
            onClick={() => props.setNewConvBox(false)}
          />
          <p className="text-xl font-bold">Nouveau message</p>
        </span>
        <button
          className="px-3 py-1 bg-white text-black font-bold rounded-2xl"
          disabled={search != '' ? false : true}
          onClick={() => createConvHandler()}
        >
          Suivant
        </button>
      </div>
      <div className="flex items-center px-4 border-b-[1px] border-slate-700">
        <FontAwesomeIcon icon={faSearch} className="h-4" />
        <input
          type="text"
          className="w-3/4 bg-transparent pl-3 rounded-full py-3  outline-0"
          placeholder="Rechercher des personnes"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ul className="max-h-[480px] min-h-[200px] overflow-y-auto">
        {lastSearch && searchResults.length < 1 ? (
          <p className="text-2xl text-center text-white pt-4">
            Aucun résultat pour "{lastSearch}"
          </p>
        ) : (
          searchResults.map((user) => (
            <li className="p-3  hover-bg" onClick={() => setTalkedUser(user)}>
              <div className="flex items-center">
                <img
                  src={user.profil_pic ? user.profil_pic : defaultPp}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="text-left px-3">
                  <p className="font-bold ">{user.pseudo}</p>
                  <p className="text-slate-500">{user.username}</p>
                  <span className="flex items-center text-slate-500">
                    <FontAwesomeIcon icon={faUser} />{' '}
                    <p className=" ml-2">Abonné</p>
                  </span>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NewConvBox;
