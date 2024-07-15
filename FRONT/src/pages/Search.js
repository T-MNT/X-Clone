import { faArrowLeft, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import Tweet from '../components/Tweet';
import { parseISO } from 'date-fns';
import ClipLoader from 'react-spinners/ClipLoader';
import defaultPp from '../assets/img/goku_sticker.png';

const Search = () => {
  ///Valeur du parametre d'URL
  const searched = useParams().searchValue;
  ///Type de recherche
  const [searchType, setSearchType] = useState('trending');
  ///Contient la valeur de l'input recherche
  const [newSearch, setNewSearch] = useState(searched);
  ///Contient la recherche précédente
  const [searchedValue, setSearchedValue] = useState(searched);
  const user = useSelector((state) => state);
  const [result, setResult] = useState([]);
  const [pending, setPending] = useState(true);

  const searchHandler = () => {
    setPending(true);
    axios
      .post('https://127.0.0.1:8000/search', {
        search: newSearch,
        type: searchType,
        id: user.id,
      })
      .then((res) => {
        if (res.status === 200) {
          let sortedResult = [];
          setSearchedValue(newSearch);
          switch (searchType) {
            case 'trending':
              sortedResult = res.data.sort((a, b) => {
                const aInteractions =
                  a.likes + a.retweets + a.answersCount + a.quotesCount;
                const bInteractions =
                  b.likes + b.retweets + b.answersCount + b.quotesCount;
                return bInteractions - aInteractions;
              });
              break;
            case 'new':
              sortedResult = res.data.sort(
                (a, b) => parseISO(b.date) - parseISO(a.date)
              );
              break;
            case 'user':
              sortedResult = res.data;
              break;
            default:
              sortedResult = res.data;
              break;
          }
          setResult(sortedResult);
        }
        setPending(false);
      });
  };

  useEffect(() => {
    if (user.id) {
      setResult([]);
      searchHandler();
    }
  }, [searched, searchType, user]);

  const resultsDisplayer = () => {
    if (result.length > 0) {
      if (searchType === 'trending' || searchType === 'new') {
        return result.map((tweet) => {
          if (tweet.content) {
            return <Tweet key={tweet.id} tweet={tweet} />;
          }
        });
      }
      if (searchType === 'user') {
        return result.map((user) => (
          <NavLink to={`/profil/${user.id}`}>
            {' '}
            <li
              key={user.id}
              className="p-3 border-b-[1px] border-slate-500 hover-bg"
            >
              <div className="flex">
                <img
                  src={user.profil_pic ? user.profil_pic : defaultPp}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="text-left px-3">
                  <p className="font-bold ">{user.pseudo}</p>
                  <p className="text-slate-500">{user.username}</p>
                  <p>{user.bio}</p>
                </div>
              </div>
            </li>
          </NavLink>
        ));
      }
    } else {
      return (
        <p className="pt-8 text-2xl font-bold">
          Aucun résultat pour "{searchedValue}"
        </p>
      );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b-[1px] border-slate-500 px-6 pt-3">
        <span className="flex items-center justify-between">
          <FontAwesomeIcon icon={faArrowLeft} />{' '}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              searchHandler();
            }}
            className="w-3/4"
          >
            {' '}
            <input
              type="text"
              className="w-full bg-search rounded-full py-3 pl-4 outline-0"
              placeholder={searched}
              onChange={(e) => setNewSearch(e.target.value)}
            />
          </form>
          <FontAwesomeIcon icon={faEllipsis} />
        </span>

        <ul className="flex justify-between font-bold text-slate-500">
          <li
            className={`${
              searchType === 'trending'
                ? 'border-b-4 border-[#1D9BF0] rounded-b-sm text-white'
                : ''
            }  py-3  cursor-pointer`}
            onClick={() => setSearchType('trending')}
          >
            A la une
          </li>
          <li
            className={`${
              searchType === 'new'
                ? 'border-b-4 border-[#1D9BF0] rounded-b-sm text-white'
                : ''
            }  py-3  cursor-pointer`}
            onClick={() => setSearchType('new')}
          >
            Recents
          </li>
          <li
            className={`${
              searchType === 'user'
                ? 'border-b-4 border-[#1D9BF0] rounded-b-sm text-white'
                : ''
            }  py-3  cursor-pointer`}
            onClick={() => setSearchType('user')}
          >
            Personnes
          </li>
          <li className={` py-3  cursor-pointer`}>Medias</li>
        </ul>
      </div>
      <div className={pending ? 'pt-8' : 'text-white'}>
        {pending ? (
          <ClipLoader
            color={'#1D9BF0'}
            size={80}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          <ul>{resultsDisplayer()}</ul>
        )}
      </div>
    </div>
  );
};

export default Search;
