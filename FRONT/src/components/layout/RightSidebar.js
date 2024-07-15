import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import defaultPP from '../../assets/img/goku_sticker.png';
import { updateUserField } from '../../redux/slices/UserSlice';
import ClipLoader from 'react-spinners/ClipLoader';

const RightSidebar = () => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [trends, setTrends] = useState([]);
  const [followPending, setFollowPending] = useState(null);

  const user = useSelector((state) => state);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  ///Récupère les tendances et les suggestions de follow
  useEffect(() => {
    axios.get('https://127.0.0.1:8000/tweet/trends/get').then((res) => {
      if (res.status === 200) {
        setTrends(res.data);
      }
    });

    if (user.id) {
      axios
        .post('https://127.0.0.1:8000/follow/suggestions', { id: user.id })
        .then((res) => {
          if (res.status === 200) {
            setSuggestions(res.data);
          }
        });
    }
  }, [user.id]);

  ///Gère le follow ( ou unfollow )
  let followHandler = (userID) => {
    setFollowPending(userID);
    let data = {
      follower: user.id,
      followed: userID,
    };

    axios
      .post('https://127.0.0.1:8000/follow', data)
      .then((res) => {
        if (res.status === 200) {
          // Unfollow successful
          let updatedFollowings = user.followings.filter(
            (follow) => follow.user.id != userID
          );
          console.log('Unfollowed:', updatedFollowings);
          dispatch(
            updateUserField({ field: 'followings', value: updatedFollowings })
          );
          setFollowPending(false);
        } else if (res.status === 201) {
          // Follow successful
          console.log('Followed response:', res);
          let updatedFollowings = [...user.followings];
          let newFollow = res.data.follow;
          newFollow.date = res.data.follow.date.date;
          // Assurez-vous que res.data.follow est défini et a la structure correcte
          if (res.data && res.data.follow) {
            updatedFollowings.push(newFollow);
            dispatch(
              updateUserField({ field: 'followings', value: updatedFollowings })
            );
            setFollowPending(null);
          } else {
            console.error('Unexpected response structure:', res.data);
            setFollowPending(null);
          }
        }
      })
      .catch((error) => {
        console.error('Error in followHandler:', error);
        setFollowPending(false);
      });
  };

  return (
    <div className="flex-1 flex flex-col bg-black min-h-[100vh] overflow-hidden border-l-[1px] border-slate-600 pt-4 text-left pl-8 text-white">
      <form onSubmit={() => navigate(`/search/${search}`)}>
        <input
          type="text"
          className="w-2/3 max-w-[350px] bg-search rounded-full py-3 pl-4 mb-6 outline-0"
          placeholder="Chercher"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </form>

      <div className="w-2/3 max-w-[350px] border-[1px]  border-slate-600 rounded-2xl mb-6  py-3">
        <p className="font-bold text-xl mb-6 px-4">Suggestions</p>
        <div>
          <ul className="w-full ">
            {suggestions.map((suggest) => (
              <NavLink to={`/profil/${suggest.id}`}>
                <li className="  mb-3 w-full mb-2 hover-bg  py-2 px-4 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <span className="flex ">
                      <img
                        className="h-12 w-12 rounded-full object-cover mr-3"
                        src={
                          suggest.profil_pic ? suggest.profil_pic : defaultPP
                        }
                      />
                      <span className="">
                        <p className="font-bold hover:underline">
                          {suggest.pseudo}
                        </p>
                        <p className="text-slate-500">{suggest.username}</p>
                      </span>
                    </span>
                    <span className="flex items-center">
                      {' '}
                      <button
                        className="bg-white font-bold text-black px-4 py-1 rounded-full mr-2"
                        onClick={(e) => {
                          e.preventDefault();
                          followHandler(suggest.id);
                        }}
                      >
                        {user.followings &&
                        user.followings.some(
                          (following) => following.user.id == suggest.id
                        )
                          ? 'Se désabonner'
                          : 'Suivre'}
                      </button>
                      {followPending === suggest.id ? (
                        <ClipLoader
                          color={'#1D9BF0'}
                          size={20}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      ) : null}
                    </span>
                  </div>

                  {suggest.followers_count ? (
                    <p className="text-sm text-slate-500 mt-1">
                      Suivi par {suggest.followers_count} personne
                      {suggest.followers_count > 1 ? 's' : null} que vous suivez{' '}
                    </p>
                  ) : null}
                </li>
              </NavLink>
            ))}
          </ul>
          <p className="text-[#1D9BF0] px-4 hover:underline cursor-pointer">
            Voir plus
          </p>
        </div>
      </div>
      <div className="w-2/3 max-w-[350px] border-[1px]  border-slate-600 rounded-2xl mb-6 pl-4 pr-8 py-3">
        <p className="font-bold text-xl mb-6">Tendances : France</p>
        <ul>
          {trends.length > 0 ? (
            trends.map((trend) => (
              <li className="mb-5">
                <NavLink to={`/trend/${trend.hashtag.replace('#', '')}`}>
                  <p className="font-bold hover:underline">{trend.hashtag}</p>
                </NavLink>
                <p className="text-sm text-slate-500">
                  {trend.count} post{trend.count > 1 ? 's' : null}
                </p>
              </li>
            ))
          ) : (
            <p className="font-bold text-lg">Pas de tendances pour le moment</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default RightSidebar;
