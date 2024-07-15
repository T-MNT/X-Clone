import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faFaceSmile,
  faFilm,
  faImage,
  faList,
  faLocationDot,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import ClipLoader from 'react-spinners/ClipLoader';
import { uploadFile, postTweetHandler } from '../utils/tweetFunctions';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Tweet from './Tweet';
import QuotedTweet from './QuotedTweet';
import defaultPp from '../assets/img/goku_sticker.png';

const PostBox = (props) => {
  const user = useSelector((state) => state);

  ///Texte du tweet
  const [tweetContent, setTweetContent] = useState('');
  ///Fichier
  const [file, setFile] = useState(null);
  ///URL du fichier pour la preview
  const [filePreview, setFilePreview] = useState(null);
  const [pending, setPending] = useState(false);
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  ///Gère le post d'un tweet via postTweetHandler ( tweetFunction.js )
  const handlePostTweet = async () => {
    setPending(true);
    const newTweet = await postTweetHandler(
      tweetContent,
      file,
      user,
      props.tweetInfo
    );

    setTweetContent('');
    setFile(null);
    setFilePreview(null);
    props.setNewTweet(newTweet);
    setPending(false);
    props.setTweetInfo(null);
  };

  let placeholderDisplayer = () => {
    if (props.tweetInfo.action === 'answer') {
      return 'Ajouter un commentaire';
    } else if (props.tweetInfo.action) {
      return 'Postez votre réponse';
    } else {
      return 'Quoi de neuf ?!';
    }
  };

  return (
    <div className="fixed z-50 top-12 left-1/2 translate-x-[-50%] rounded-2xl h-fit w-[600px] bg-black px-6 py-5">
      <div className="flex justify-between mb-4">
        <FontAwesomeIcon
          icon={faX}
          className="cursor-pointer"
          color="#FFFFFF"
          onClick={() => {
            props.setTweetInfo(null);
          }}
        />
        <p className="text-[#1D9BF0] font-bold">Brouillons</p>
      </div>
      {props.tweetInfo && props.tweetInfo.action === 'answer' ? (
        <div className="flex mb-8">
          <img
            src={
              props.tweetInfo.tweet.author.profil_pic
                ? props.tweetInfo.tweet.author.profil_pic
                : defaultPp
            }
            className="min-h-12 min-w-12 max-h-12 max-w-12 object-cover rounded-full mr-3"
          />
          <div className="w-full px-2 text-white text-left">
            <div className="flex items-center mb-1">
              <p className="mr-2 text-lg font-bold">
                {props.tweetInfo.tweet.author.pseudo}
              </p>
              <p className="text-slate-500">
                {props.tweetInfo.tweet.author.username}
              </p>
            </div>
            <p>{props.tweetInfo.tweet.content}</p>

            {filePreview &&
              (file.type.startsWith('video/') ? (
                <video
                  src={filePreview}
                  controls
                  className="w-full rounded-lg my-4"
                />
              ) : (
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-full rounded-lg my-4 max-h-[460px] object-cover mx-auto"
                />
              ))}
          </div>
        </div>
      ) : null}
      <div className="flex">
        <img
          src={user.profil_pic ? user.profil_pic : defaultPp}
          className="min-h-12 min-w-12 max-h-12 max-w-12 object-cover rounded-full mr-3"
        />
        <div className="w-full px-1">
          <textarea
            className="w-full pt-2 mb-2 bg-transparent text-lg pl-2 text-slate-300 min-h-[40px] outline-none focus:outline-[#1D9BF0] rounded-sm"
            placeholder={placeholderDisplayer()}
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
          ></textarea>

          <span className="h-fit w-fit relative">
            {' '}
            {filePreview &&
              (file.type.startsWith('video/') ? (
                <video
                  src={filePreview}
                  controls
                  className="w-full rounded-lg my-4"
                />
              ) : (
                <img
                  src={filePreview}
                  alt="Preview"
                  className=" rounded-lg my-4 max-h-[320px] object-cover mx-auto"
                />
              ))}
          </span>
        </div>
      </div>
      <div className="flex">
        <div className="min-w-[52px]" />
        <div className="px-4">
          {props.tweetInfo.action === 'quote' ? (
            <QuotedTweet tweet={props.tweetInfo.tweet} />
          ) : null}
        </div>
      </div>

      <span className="w-full flex justify-between border-t-[1px] border-slate-700 pt-3">
        <ul className="w-full flex items-center">
          <li className="mr-3">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setFilePreview(URL.createObjectURL(e.target.files[0]));
                }}
              />
              <FontAwesomeIcon
                icon={faImage}
                style={{ color: '#1d9bf0', cursor: 'pointer' }}
                onClick={handleIconClick}
              />
            </div>
          </li>
          <li className="mr-3">
            <FontAwesomeIcon icon={faFilm} color="#1D9BF0" />
          </li>
          <li className="mr-3">
            <FontAwesomeIcon icon={faList} color="#1D9BF0" />
          </li>
          <li className="mr-3">
            <FontAwesomeIcon icon={faFaceSmile} color="#1D9BF0" />
          </li>
          <li className="mr-3">
            <FontAwesomeIcon icon={faCalendar} color="#1D9BF0" />
          </li>
          <li className="mr-3">
            <FontAwesomeIcon icon={faLocationDot} color="#1D9BF0" />
          </li>
        </ul>
        <span className="flex items-center">
          <button
            className={`${
              pending ? 'bg-[#136298] mr-4' : 'bg-[#1D9BF0]'
            } px-5 py-[6px] text-white font-bold rounded-full`}
            onClick={handlePostTweet}
            disabled={pending}
          >
            Poster
          </button>
          {pending ? (
            <ClipLoader
              color={'#1D9BF0'}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : null}
        </span>
      </span>
    </div>
  );
};

export default PostBox;
