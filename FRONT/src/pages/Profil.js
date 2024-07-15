import {
  faArrowLeft,
  faCakeCandles,
  faCalendar,
  faEnvelope,
  faLink,
  faMapPin,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import profilBG from '../assets/img/poisson.png';
import profilPP from '../assets/img/goku_sticker.png';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Tweet from '../components/Tweet';
import { parseISO } from 'date-fns';
import { formatDate } from '../utils/tweetFunctions';
import { NavLink, useParams } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import FollowsDisplayer from '../components/FollowsDisplayer';
import { setUserRedux, updateUserField } from '../redux/slices/UserSlice';
import { newTweetDisplayer } from '../utils/tweetFunctions';

const Profil = (props) => {
  const dispatch = useDispatch();
  ///ID de l'utilisateur dont on visite le profil (parametre de l'url)
  const userId = useParams().id;
  ///Utilisateur actuel ( state redux )
  const user = useSelector((state) => state);
  ///Contient les infos de l'utilisateur dont on visite le profil
  const [userData, setUserData] = useState({});
  ///Triggers pour les spinners
  const [userDataPending, setUserDataPending] = useState(true);
  const [userTweetsPending, setUserTweetsPending] = useState(true);

  ///Contient les tweets à afficher
  const [tweetToDisplay, setTweetToDisplay] = useState([]);

  const [autoCloseFollows, setAutoCloseFollows] = useState(true);

  const [followsDisplayer, setFollowsDisplayer] = useState({
    active: false,
    type: null,
  });

  ///Contient le texte dans le bouton d'interaction sur les profils d'autres
  ///utilisateurs (Abonné qui devient "se désabonner")
  const [followButtonText, setFollowButtonText] = useState({
    content: 'Abonné',
    style:
      'bg-transparent text-slate-300 py-[6px] border-slate-700 border-[1px] font-bold rounded-full w-[146px]',
  });

  const [followPending, setFollowPending] = useState(false);

  const [tweetType, setTweetType] = useState('posts');

  const followingsHoverTimeout = useRef(null);
  const followersHoverTimeout = useRef(null);

  useEffect(() => {
    if (tweetToDisplay.length > 0 && props.newTweet) {
      newTweetDisplayer(
        props.newTweet,
        tweetToDisplay,
        setTweetToDisplay,
        props.setNewTweet
      );
    }
  }, [props.newTweet]);

  useEffect(() => {
    setFollowsDisplayer({
      active: false,
      type: null,
    });
    if (user.id && user.id == userId) {
      setUserData(user);
      setUserDataPending(false);
    } else {
      axios.post('https://127.0.0.1:8000/user/find', userId).then((res) => {
        setUserData(res.data);
        setUserDataPending(false);
      });
    }
  }, [user, userId]);

  useEffect(() => {
    setUserTweetsPending(true);
    if (userData.id) {
      axios
        .post('https://127.0.0.1:8000/tweet/find/userTweets', {
          id: userData.id,
          type: tweetType,
        })
        .then((res) => {
          console.log(res);
          let tweets = res.data;
          let sortedTweets = tweets.sort(
            (a, b) => parseISO(b.date) - parseISO(a.date)
          );
          if (tweetType === 'medias') {
            sortedTweets = sortedTweets.filter((tweet) => {
              if (
                !tweet.media_url.includes('.mp4') &&
                !tweet.media_url.includes('.webm')
              ) {
                return tweet;
              }
            });
          }
          setUserTweetsPending(false);
          setTweetToDisplay(sortedTweets);
        });
    }
  }, [userData, tweetType]);

  let followHandler = () => {
    setFollowPending(true);
    let data = {
      follower: user.id,
      followed: userId,
    };

    axios
      .post('https://127.0.0.1:8000/follow', data)
      .then((res) => {
        if (res.status === 200) {
          // Unfollow successful
          let updatedFollowings = user.followings.filter(
            (follow) => follow.user.id != userId
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
            setFollowPending(false);
          } else {
            console.error('Unexpected response structure:', res.data);
            setFollowPending(false);
          }
        }
      })
      .catch((error) => {
        console.error('Error in followHandler:', error);
        setFollowPending(false);
      });
  };

  return (
    <div className="min-h-screen h-full bg-black text-white">
      {userDataPending ? (
        <div className="py-24">
          <ClipLoader
            color={'#1D9BF0'}
            size={80}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div>
          {' '}
          <div className="border-b-[1px] border-slate-700 flex items-center py-1 p-3">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-10" />
            <span className="text-left">
              <p className="font-bold text-lg">
                {userData.pseudo ? userData.pseudo : null}
              </p>
              <p className="text-slate-500">{tweetToDisplay.length} posts</p>
            </span>
          </div>
          <img
            src={userData.cover_pic ? userData.cover_pic : profilBG}
            className="w-full h-[200px] object-cover"
          />
          <div className={`relative pb-3`}>
            <img
              className="h-[152px] w-[152px] rounded-full absolute left-4 top-[-76px] object-cover border-[4px] border-black"
              src={userData.profil_pic ? userData.profil_pic : profilPP}
            />
            <div className="flex items-center justify-end py-3 pr-6">
              {userData.id == user.id ? (
                <button
                  className="border-[1px] border-slate-700 px-5 py-[6px] text-white font-bold rounded-full"
                  onClick={() => props.setEditProfil(true)}
                >
                  Editer le profil
                </button>
              ) : (
                <span>
                  <button className="border-[1px] border-slate-700 w-10 h-10 text-white font-bold rounded-full mr-2">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </button>
                  {user.followings &&
                  user.followings.length > 0 &&
                  user.followings.some(
                    (following) => following.user.id == userId
                  ) ? (
                    <button
                      className={followButtonText.style}
                      onClick={() => followHandler()}
                      onMouseEnter={() =>
                        setFollowButtonText({
                          content: 'se désabonner',
                          style:
                            'bg-red-800/15 text-red-700 py-[6px] border-slate-700 border-[1px] font-bold rounded-full w-[146px]',
                        })
                      }
                      onMouseLeave={() =>
                        setFollowButtonText({
                          content: 'Abonné',
                          style:
                            'bg-transparent text-slate-300 py-[6px] border-slate-700 border-[1px] font-bold rounded-full w-[146px]',
                        })
                      }
                    >
                      {followButtonText.content}
                    </button>
                  ) : (
                    <button
                      className="bg-white text-black px-5 py-[6px] font-bold rounded-full"
                      onClick={() => followHandler()}
                    >
                      Suivre
                    </button>
                  )}
                </span>
              )}
              {followPending ? (
                <ClipLoader
                  color={'#1D9BF0'}
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                  className="ml-2"
                />
              ) : null}
            </div>

            <div className="pl-6 pt-6 mb-3">
              <p className="font-bold text-xl text-left">
                {userData.pseudo ? userData.pseudo : null}
              </p>
              <p className="text-slate-500 text-left">
                {userData.username ? userData.username : null}
              </p>
            </div>
            {userData.bio ? (
              <div className="text-left px-6 mb-3">
                <p>{userData.bio}</p>
              </div>
            ) : null}

            {userData.website || userData.location ? (
              <div className="flex pl-6 mb-3">
                {userData.location ? (
                  <span className="flex items-center mr-8">
                    <FontAwesomeIcon
                      icon={faMapPin}
                      className="mr-2 text-slate-500"
                    />
                    <p className="text-slate-500">{userData.location}</p>
                  </span>
                ) : null}
                {userData.website ? (
                  <span className="flex items-center mr-8">
                    <FontAwesomeIcon
                      icon={faLink}
                      className="mr-2 text-slate-500"
                    />
                    <a
                      href={'https://' + userData.website}
                      className="text-[#1C9AF0]"
                    >
                      {userData.website}
                    </a>
                  </span>
                ) : null}
              </div>
            ) : null}
            <div className="flex pl-6 mb-3">
              <span className="flex items-center mr-8">
                <FontAwesomeIcon
                  icon={faCakeCandles}
                  className="mr-2 text-slate-500"
                />
                <p className="text-slate-500">
                  Naissance le{' '}
                  {userData.birthdate
                    ? formatDate(userData.birthdate.date.split(' ')[0])
                    : null}
                </p>
              </span>
              <span className="flex items-center">
                <FontAwesomeIcon
                  icon={faCalendar}
                  className="mr-2 text-slate-500"
                />
                <p className="text-slate-500">
                  A rejoint Twitter en Juillet 2015
                </p>
              </span>
            </div>
            <div className="flex text-slate-500 pl-6">
              <p
                className="mr-6 cursor-pointer"
                onMouseEnter={() => {
                  followingsHoverTimeout.current = setTimeout(() => {
                    if (userData.followings.length > 0) {
                      setFollowsDisplayer({ active: true, type: 'followings' });
                      setAutoCloseFollows(false);
                    }
                  }, 300);
                }}
                onMouseLeave={() => {
                  clearTimeout(followingsHoverTimeout.current);
                  setAutoCloseFollows(true);
                }}
              >
                <span className="font-bold text-white">
                  {userData.followings.length}
                </span>{' '}
                abonnements
              </p>
              <p
                className="cursor-pointer"
                onMouseEnter={() => {
                  followersHoverTimeout.current = setTimeout(() => {
                    if (userData.followers.length > 0) {
                      setFollowsDisplayer({ active: true, type: 'followers' });
                      setAutoCloseFollows(false);
                    }
                  }, 300);
                }}
                onMouseLeave={() => {
                  clearTimeout(followersHoverTimeout.current);
                  setAutoCloseFollows(true);
                }}
              >
                <span className="font-bold text-white ">
                  {userData.followers.length}
                </span>{' '}
                abonnés
              </p>
            </div>
            {followsDisplayer.active ? (
              <FollowsDisplayer
                setFollowsDisplayer={setFollowsDisplayer}
                follows={
                  followsDisplayer.type === 'followers'
                    ? userData.followers
                    : userData.followings
                }
                type={followsDisplayer.type}
                autoClose={autoCloseFollows}
                setAutoClose={setAutoCloseFollows}
              />
            ) : null}
          </div>
        </div>
      )}

      <div>
        <ul className="flex justify-between text-slate-500 px-6  border-b-[1px] border-slate-700  font-bold">
          <li
            className={`${
              tweetType === 'posts'
                ? 'border-b-4 border-[#1D9BF0] rounded-b-sm text-white'
                : ''
            }  py-3  cursor-pointer`}
            onClick={() => setTweetType('posts')}
          >
            Posts
          </li>
          <li
            className={`${
              tweetType === 'answers'
                ? 'border-b-4 border-[#1D9BF0] rounded-b-sm text-white'
                : ''
            }  py-3  cursor-pointer`}
            onClick={() => setTweetType('answers')}
          >
            Réponses
          </li>
          <li
            className={`${
              tweetType === 'medias'
                ? 'border-b-4 border-[#1D9BF0] rounded-b-sm text-white'
                : ''
            }  py-3  cursor-pointer`}
            onClick={() => setTweetType('medias')}
          >
            Médias
          </li>
          <li
            className={`${
              tweetType === 'likes'
                ? 'border-b-4 border-[#1D9BF0] rounded-b-sm text-white'
                : ''
            }  py-3  cursor-pointer`}
            onClick={() => setTweetType('likes')}
          >
            J'aime
          </li>
        </ul>
        {userTweetsPending ? (
          <div className="py-24">
            {' '}
            <ClipLoader
              color={'#1D9BF0'}
              size={80}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <div>
            {' '}
            {tweetType != 'medias' ? (
              <ul>
                {tweetToDisplay.map((tweet) => (
                  <Tweet
                    setTweetToDisplay={setTweetToDisplay}
                    setNewTweet={props.setNewTweet}
                    setPostBox={props.setPostBox}
                    tweetToDisplay={tweetToDisplay}
                    tweet={tweet}
                    setTweetInfo={props.setTweetInfo}
                  />
                ))}
              </ul>
            ) : (
              <ul className="flex flex-wrap">
                {tweetToDisplay.map((tweet) => (
                  <NavLink
                    to={`/tweet/${
                      tweet.related_tweet ? tweet.related_tweet.id : tweet.id
                    }`}
                    className={'w-1/3 h-[196px]'}
                  >
                    {' '}
                    <img
                      src={tweet.media_url}
                      className="h-full w-full object-cover cursor-pointer border-2 border-black"
                    />
                  </NavLink>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profil;
