import {
  faBookmark,
  faCalendar,
  faChartSimple,
  faComment,
  faFaceSmile,
  faFilm,
  faGear,
  faHeart,
  faImage,
  faList,
  faLocationDot,
  faQuoteLeft,
  faRetweet,
  faTrash,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';
import React, { useEffect, useState } from 'react';
import QuotedTweet from './QuotedTweet';
import { formatTimeAgo } from '../utils/tweetFunctions';
import defaultPp from '../assets/img/goku_sticker.png';
import { NavLink } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import DeletedTweet from './DeletedTweet';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserField } from '../redux/slices/UserSlice';

const Tweet = (props) => {
  ///Recupere l'user stocké dans le state Redux
  let user = useSelector((state) => state);

  const dispatch = useDispatch();

  ///Triggers d'action en cours ( pour afficher les spinners )
  const [pending, setPending] = useState('');
  const [signetPending, setSignetPending] = useState(false);
  const [isSignet, setIsSignet] = useState(false);

  ///Gère le like ou le retweet d'un tweet ( création ou suppression )
  let likeRetweetHandler = (tweet_id, type, e) => {
    e.preventDefault();

    // Créer une copie de l'objet tweet pour éviter les erreurs de lecture seule
    let tweet = { ...props.tweet };

    let likeRetweet = {
      author_id: user.id,
      tweet_id: tweet_id,
      type: type,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    if (type === 'like') {
      setPending('like');
      if (tweet.userLiked) {
        tweet.userLiked = false;
        tweet.likes = tweet.likes - 1;
        likeRetweet.action = 'delete';
      } else {
        tweet.userLiked = true;
        tweet.likes = tweet.likes + 1;
        likeRetweet.action = 'create';
      }
    }

    if (type === 'retweet') {
      setPending('retweet');
      if (tweet.userRetweeted) {
        tweet.userRetweeted = false;
        tweet.retweets = tweet.retweets - 1;
        likeRetweet.action = 'delete';
      } else {
        tweet.userRetweeted = true;
        tweet.retweets = tweet.retweets + 1;
        likeRetweet.action = 'create';
      }
    }

    axios
      .post('https://127.0.0.1:8000/tweet/likeOrRt', likeRetweet)
      .then((res) => {
        props.setNewTweet(tweet);
        setPending('');
        console.log(tweet);
      })
      .catch((error) => {
        console.error('Error updating like or retweet:', error);
        setPending('');
      });

    return;
  };

  ///Gère l'affichage du tweet cité ( tweet cité supprimé ou non )
  let quotedTweetHandler = () => {
    if (props.tweet.type === 'quote') {
      if (props.tweet.related_tweet.id === 0) {
        return <DeletedTweet tweet={props.tweet.related_tweet} />;
      } else {
        return <QuotedTweet tweet={props.tweet.related_tweet} />;
      }
    }
  };

  ///Gere la création ou la suppression du signet
  let signetHandler = () => {
    setSignetPending(true);

    let userSignets = user.signets;
    const isSignet = userSignets
      ? user.signets.find((signet) => signet.tweet.id === props.tweet.id)
      : null;
    let updatedSignets = [...user.signets];

    if (isSignet) {
      axios
        .post('https://127.0.0.1:8000/signet/delete', { id: isSignet.id })
        .then((res) => {
          if (res.status === 200) {
            updatedSignets = updatedSignets.filter(
              (signet) => signet.tweet.id !== props.tweet.id
            );
            dispatch(
              updateUserField({ field: 'signets', value: updatedSignets })
            );
          }
          setSignetPending(false);
        })
        .catch((error) => {
          console.error('Failed to delete signet:', error);
          setSignetPending(false);
        });
    } else {
      axios
        .post('https://127.0.0.1:8000/signet/create', {
          user: user.id,
          tweet: props.tweet.id,
        })
        .then((res) => {
          if (res.status === 201) {
            updatedSignets.push(res.data);
            dispatch(
              updateUserField({ field: 'signets', value: updatedSignets })
            );
          }
          setSignetPending(false);
        })
        .catch((error) => {
          console.error('Failed to create signet:', error);
          setSignetPending(false);
        });
    }
  };

  useEffect(() => {
    if (user.signets) {
      const isSignet = user.signets.find(
        (signet) => signet.tweet.id === props.tweet.id
      );

      if (isSignet) {
        setIsSignet(true);
      } else {
        setIsSignet(false);
      }
    }
  }, [user]);

  ///Remplace les #exemple par des Navlink qui amènent sur la page de la tendance
  let tweetContentDisplayer = () => {
    let hashtags =
      props.tweet.hashtags != null ? props.tweet.hashtags.split(',') : '';
    let content = props.tweet.content;

    if (hashtags.length > 0) {
      const replaceHashtagsWithLinks = (content, hashtags) => {
        // Séparer le contenu en mots
        const words = content.split(' ');

        return words.map((word, index) => {
          // Vérifier si le mot est un hashtag
          if (hashtags.includes(word)) {
            return (
              <NavLink
                key={index}
                to={`/trend/${word.replace('#', '')}`}
                className="text-[#1D9BF0]"
              >
                {word + ' '}
              </NavLink>
            );
          } else {
            return word + ' ';
          }
        });
      };

      // Remplacer les hashtags dans le contenu du tweet
      const contentWithLinks = replaceHashtagsWithLinks(content, hashtags);

      return <span>{contentWithLinks}</span>;
    } else {
      return <span>{content}</span>;
    }
  };

  return (
    <NavLink to={`/tweet/${props.tweet.id}`}>
      <li
        className={`text-left list-none border-slate-700 z-0 py-3 hover-bg border-b-[1px] relative`}
      >
        {props.tweet.author.id == user.id ? (
          <FontAwesomeIcon
            icon={faTrash}
            className="absolute right-3 top-3 text-white"
            size="xs"
            onClick={(e) => {
              e.preventDefault();
              props.setTweetInfo({ tweet: props.tweet, action: 'delete' });
            }}
          />
        ) : null}

        <div className={'px-6 w-full flex'}>
          <NavLink to={`/profil/${props.tweet.author.id}`} className={'h-fit'}>
            <img
              src={
                props.tweet.author.profil_pic
                  ? props.tweet.author.profil_pic
                  : defaultPp
              }
              className="min-h-12 min-w-12 max-h-12 max-w-12 object-cover rounded-full mr-3"
            />
          </NavLink>

          <div className="w-full pr-6">
            {props.tweet.type === 'answer' ? (
              <NavLink to={`/tweet/${props.tweet.related_tweet.id}`}>
                <p className="text-sm text-slate-600 underline-offset-2 hover:underline">
                  En réponse à {props.tweet.related_tweet.author.username}
                </p>
              </NavLink>
            ) : null}

            {props.tweet.userRetweeted && props.tweet.type != 'answer' ? (
              <p className="flex items-center text-sm text-slate-600 ">
                A été retweeté
                <FontAwesomeIcon icon={faRetweet} className="ml-1" />
              </p>
            ) : null}
            <span className="flex text-slate-800 mb-1 items-center">
              <NavLink to={`/profil/${props.tweet.author.id}`}>
                <p className="font-bold text-white mr-1 text-lg underline-offset-2 hover:underline">
                  {props.tweet.author.pseudo}
                </p>
              </NavLink>
              <NavLink to={`/profil/${props.tweet.author.id}`}>
                <p className="text-slate-600 mr-3">
                  {props.tweet.author.username}
                </p>
              </NavLink>
              <NavLink to={`/profil/${props.tweet.author_id}`}>
                <p className="text-slate-600">
                  {formatTimeAgo(props.tweet.date)}
                </p>
              </NavLink>
            </span>
            <span className=" overflow-hidden w-full text-white">
              <p>{tweetContentDisplayer()}</p>
            </span>
            {props.tweet.media_url && (
              <>
                {props.tweet.media_url.includes('.mp4') ||
                props.tweet.media_url.includes('.webm') ? (
                  <video
                    src={props.tweet.media_url}
                    controls
                    className="my-3 rounded-lg"
                  />
                ) : (
                  <img
                    src={props.tweet.media_url}
                    className="my-3 rounded-lg max-h-[460px] mx-auto"
                  />
                )}
              </>
            )}
            {quotedTweetHandler()}
            {props.tweet.quoted ? null : (
              <div className="w-full flex justify-between mt-3 items-center">
                <ul className="flex justify-between w-[80%]  text-slate-500">
                  <li className="flex items-center ">
                    <FontAwesomeIcon
                      icon={faComment}
                      className="cursor-pointer z-10"
                      onClick={(e) => {
                        e.preventDefault();
                        props.setTweetInfo({
                          tweet: props.tweet,
                          action: 'answer',
                        });
                      }}
                    />
                    <p className="mx-1">{props.tweet.answersCount}</p>
                  </li>
                  <li
                    className={`flex items-center ${
                      props.tweet.userRetweeted ? 'text-[#00BA7C]' : null
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faRetweet}
                      className=" cursor-pointer"
                      onClick={(e) => {
                        likeRetweetHandler(props.tweet.id, 'retweet', e);
                      }}
                    />
                    <p className="mx-1">{props.tweet.retweets}</p>
                    {pending === 'retweet' ? (
                      <ClipLoader
                        color={'#1D9BF0'}
                        size={15}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    ) : null}
                  </li>
                  <li className="flex items-center ">
                    <FontAwesomeIcon
                      icon={faQuoteLeft}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        props.setTweetInfo({
                          tweet: props.tweet,
                          action: 'quote',
                        });
                      }}
                    />
                    <p className="mx-1">{props.tweet.quotesCount}</p>
                  </li>
                  <li
                    className={`flex items-center ${
                      props.tweet.userLiked ? 'text-[#F81980]' : null
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="cursor-pointer"
                      onClick={(e) => {
                        likeRetweetHandler(props.tweet.id, 'like', e);
                      }}
                    />
                    <p className="mx-1">{props.tweet.likes}</p>
                    {pending === 'like' ? (
                      <ClipLoader
                        color={'#1D9BF0'}
                        size={15}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    ) : null}
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon
                      icon={faChartSimple}
                      className="cursor-pointer"
                    />
                    <p className="ml-2">
                      {props.tweet.likes +
                        props.tweet.retweets +
                        props.tweet.answersCount +
                        props.tweet.quotesCount}
                    </p>
                  </li>
                </ul>
                <span className="flex items-center">
                  <FontAwesomeIcon
                    icon={faBookmark}
                    className={isSignet ? 'text-[#1D9BF0]' : 'text-slate-500'}
                    onClick={(e) => {
                      e.preventDefault();
                      signetHandler();
                    }}
                  />
                  {signetPending ? (
                    <ClipLoader
                      color={'#1D9BF0'}
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                      className="ml-1"
                    />
                  ) : null}
                </span>
              </div>
            )}
          </div>
        </div>
      </li>
    </NavLink>
  );
};

export default Tweet;
