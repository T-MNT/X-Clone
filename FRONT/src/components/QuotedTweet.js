import React from 'react';
import { formatTimeAgo } from '../utils/tweetFunctions';
import defaultPp from '../assets/img/goku_sticker.png';
import { NavLink } from 'react-router-dom';

const QuotedTweet = (props) => {
  return (
    <div
      className={`text-left list-none border-slate-700 py-3 border-[1px] rounded-2xl p-2 my-4`}
    >
      <div className={`  w-full flex `}>
        <NavLink to={`/profil/${props.tweet.author.id}`}>
          <img
            src={
              props.tweet.author.profil_pic
                ? props.tweet.author.profil_pic
                : defaultPp
            }
            className="min-h-8 min-w-8 max-h-8 max-w-8 object-cover rounded-full mr-3"
          />
        </NavLink>
        <div className="w-full pr-6">
          <span className="flex items-center text-slate-800 mb-1">
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
            <NavLink to={`/profil/${props.tweet.author.id}`}>
              <p className="text-slate-600">
                {formatTimeAgo(props.tweet.date)}
              </p>
            </NavLink>
          </span>
          <span className=" overflow-hidden w-full text-white">
            <p>{props.tweet.content}</p>
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
                <img src={props.tweet.media_url} className="my-3 rounded-lg" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotedTweet;
