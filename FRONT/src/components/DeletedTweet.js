import { faBan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const DeletedTweet = (props) => {
  return (
    <div
      className={`text-left flex justify-center text-white items-center list-none border-slate-700 py-6 border-[1px] rounded-2xl p-2 my-4`}
    >
      <FontAwesomeIcon icon={faBan} className="mr-2" size="xl" />
      <p className="font-bold">{props.tweet.content}</p>
    </div>
  );
};

export default DeletedTweet;
