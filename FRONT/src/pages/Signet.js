import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Tweet from '../components/Tweet';
import { newTweetDisplayer } from '../utils/tweetFunctions';

const Signet = (props) => {
  const user = useSelector((state) => state);
  const [tweetToDisplay, setTweetToDisplay] = useState([]);

  ///Quand on récupere le tableau des signets de l'utilisateur depuis le state redux
  ///on boucle sur le tableau pour récupérer le tweet de chaque signet puis on attribue les tweets
  ///à afficher au state
  useEffect(() => {
    if (user.signets) {
      let tweets = [];
      user.signets.forEach((signet) => {
        tweets.push(signet.tweet);
      });
      setTweetToDisplay(tweets);
    }
  }, [user.signets]);

  ///newTweet est le tweet modifié lorsqu'on intéragit avec un tweet ( like, retweet, etc), on filtre les tweets
  ///à afficher pour exclure l'ancien tweet et on remplace donc l'ancienne version par la nouvelle
  useEffect(() => {
    if (props.newTweet && tweetToDisplay.length > 0) {
      newTweetDisplayer(
        props.newTweet,
        tweetToDisplay,
        setTweetToDisplay,
        props.setNewTweet
      );
    }
  }, [props.newTweet]);

  return (
    <div className="min-h-screen h-full bg-black">
      <div className="text-left px-3 py-2 border-b-[1px] border-slate-700">
        <p className="text-white text-xl font-bold">Signets</p>
        <p className="text-slate-500 text-sm">{user.username}</p>
      </div>
      <ul>
        {tweetToDisplay.length > 0 ? (
          tweetToDisplay.map((tweet) => (
            <Tweet
              id={tweet.id}
              tweet={tweet}
              setNewTweet={props.setNewTweet}
              setTweetInfo={props.setTweetInfo}
            />
          ))
        ) : (
          <p className="text-white text-2xl font-bold pt-8">
            Vous n'avez aucun signet pour le moment
          </p>
        )}
      </ul>
    </div>
  );
};

export default Signet;
