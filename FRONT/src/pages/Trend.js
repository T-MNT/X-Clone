import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Tweet from '../components/Tweet';
import ClipLoader from 'react-spinners/ClipLoader';

const Trend = (props) => {
  const trend = useParams().hashtag;
  const user = useSelector((state) => state);
  const [tweetToDisplay, setTweetToDisplay] = useState([]);
  const [pending, setPending] = useState(true);

  ///Met à jour les tweets à afficher si création ou suppression d'un tweet
  useEffect(() => {
    if (props.newTweet) {
      let newTweet = props.newTweet;

      if (newTweet.type === 'answer' || newTweet.type === 'quote') {
        let tweetToEdit = tweetToDisplay.filter(
          (tweet) => tweet.id == newTweet.related_tweet.id
        )[0];

        if (newTweet.type === 'answer') {
          tweetToEdit.answersCount++;
        } else {
          tweetToEdit.quotesCount++;
        }
      }

      setTweetToDisplay((prevTweets) => {
        const tweetExists = prevTweets.some(
          (tweet) => tweet.id === newTweet.id
        );
        if (tweetExists) {
          return prevTweets.map((tweet) =>
            tweet.id === newTweet.id ? newTweet : tweet
          );
        } else {
          return [newTweet, ...prevTweets];
        }
      });

      props.setNewTweet(null);
    }
  }, [props.newTweet]);

  ///Recupere les tweets de la trend
  useEffect(() => {
    setPending(true);
    if (user.id) {
      axios
        .post('https://127.0.0.1:8000/tweet/get/byTrend', {
          trend: trend,
          user: user.id,
        })
        .then((res) => {
          if (res.status === 200) {
            setTweetToDisplay(res.data);
            setPending(false);
          }
        });
    }
  }, [trend, user]);

  return (
    <div className="bg-black text-white min-h-screen h-full">
      <div className="border-b-[1px] flex justify-between items-center border-slate-700 px-6 py-2 text-left">
        <span className="flex items-center">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-6" />
          <span>
            <p className="text-xl font-bold">Tendances</p>
            <p className="text-lg">{'#' + trend}</p>
          </span>
        </span>
        <p className="text-slate-500 text-sm ml-6">
          {tweetToDisplay.length + ' posts'}
        </p>
      </div>
      {pending ? (
        <ClipLoader
          color={'#1D9BF0'}
          size={80}
          aria-label="Loading Spinner"
          data-testid="loader"
          className="mt-10"
        />
      ) : (
        <ul>
          {tweetToDisplay.map((tweet) => (
            <Tweet
              id={tweet.id}
              tweet={tweet}
              setNewTweet={props.setNewTweet}
              setTweetInfo={props.setTweetInfo}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Trend;
