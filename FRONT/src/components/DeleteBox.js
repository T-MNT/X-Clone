import React, { useState } from 'react';
import QuotedTweet from './QuotedTweet';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import ClipLoader from 'react-spinners/ClipLoader';

const DeleteBox = (props) => {
  const [pending, setPending] = useState(false);

  let deleteTweetHandler = () => {
    setPending(true);
    let tweetId = props.tweetInfo.tweet.id;
    axios
      .post('https://127.0.0.1:8000/tweet/delete', { id: tweetId })
      .then((res) => {
        console.log(res);
        setPending(false);
        props.setTweetInfo(null);
      });
  };

  return (
    <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[400px]  bg-black text-white  rounded-xl">
      <div className=" p-6 relative">
        <FontAwesomeIcon
          icon={faX}
          className="cursor-pointer absolute left-3 top-3 "
          color="#FFFFFF"
          onClick={() => {
            props.setTweetInfo(null);
          }}
        />
        <p className="font-bold mb-6">Voulez-vous supprimer ce tweet :</p>

        <QuotedTweet tweet={props.tweetInfo.tweet} />
        <div className="flex justify-between mt-8">
          <button
            className="border-[1px] border-slate-500 w-[150px] text-white text-center py-2 font-bold rounded-full "
            onClick={() => props.setTweetInfo(null)}
          >
            Annuler
          </button>
          <button
            className="bg-red-500 w-[150px] text-white text-center py-2 font-bold rounded-full "
            onClick={() => deleteTweetHandler()}
          >
            <span className="flex justify-center items-center">
              <p className="mr-3">Supprimer</p>
              {pending ? (
                <ClipLoader
                  color={'#1D9BF0'}
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : null}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBox;
