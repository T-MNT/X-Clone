import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Tweet from '../components/Tweet';

const TweetPage = (props) => {
  const tweetId = useParams().id;
  const user = useSelector((state) => state);

  const [tweet, setTweet] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (user.id) {
      let data = {
        tweetId: tweetId,
        userId: user.id,
      };
      axios.post('https://localhost:8000/tweet/find', data).then((res) => {
        if (res.status === 200) {
          setTweet(res.data.tweet);
          setAnswers(res.data.answers);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (props.newTweet) {
      if (props.newTweet.id === tweet.id) {
        setTweet(props.newTweet);
      } else {
        setAnswers((prevTweets) => {
          const tweetExists = prevTweets.some(
            (tweet) => tweet.id === props.newTweet.id
          );
          if (tweetExists) {
            return prevTweets.map((tweet) =>
              tweet.id === props.newTweet.id ? props.newTweet : tweet
            );
          } else {
            return [props.newTweet, ...prevTweets];
          }
        });
      }

      props.setNewTweet(null);
    }
  }, [props.newTweet]);

  return (
    <div className="bg-black min-h-screen h-full">
      <div className="border-b-[1px] border-slate-700 text-white flex items-center py-2 p-3">
        <FontAwesomeIcon icon={faArrowLeft} className="mr-10" />

        <p className="text-xl font-bold">Poster</p>
      </div>
      {tweet ? (
        <Tweet
          id={tweet.id}
          setPostBox={props.setPostBox}
          tweet={tweet}
          setNewTweet={props.setNewTweet}
          setTweetInfo={props.setTweetInfo}
        />
      ) : null}
      <ul>
        {answers.length > 0
          ? answers.map((tweet) => (
              <Tweet
                id={tweet.id}
                setPostBox={props.setPostBox}
                tweet={tweet}
                setNewTweet={props.setNewTweet}
                setTweetInfo={props.setTweetInfo}
              />
            ))
          : null}
      </ul>
    </div>
  );
};

export default TweetPage;
