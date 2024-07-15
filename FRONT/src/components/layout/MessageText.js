import {
  faFilm,
  faImage,
  faInfo,
  faPaperPlane,
  faSmile,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import '../../styles/messages.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { uploadFile } from '../../utils/fileFunctions';
import defaultPp from '../../assets/img/goku_sticker.png';

const MessageText = (props) => {
  const user = useSelector((state) => state);
  const [messageContent, setMessageContent] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (props.activeConv) {
      setAllMessages(props.activeConv.messages);
      scrollToBottom();

      const intervalId = setInterval(() => {
        axios
          .post(`https://127.0.0.1:8000/conversation/get/messages`, {
            id: props.activeConv.id,
          })
          .then((res) => {
            if (res.status === 200) {
              setAllMessages(res.data);
              scrollToBottom();
            }
          });
      }, 20000);

      return () => clearInterval(intervalId);
    }
  }, [props.activeConv]);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const postMessageHandler = async () => {
    if (messageContent !== '' || file) {
      let url = null;
      if (file) {
        url = await uploadFile(file);
      }
      const message = {
        content: messageContent,
        media_url: url,
        authorId: user.id,
        convId: props.activeConv.id,
      };

      axios
        .post('https://127.0.0.1:8000/conversation/post/message', message)
        .then((res) => {
          if (res.status === 201) {
            setAllMessages((prevMessages) => [...prevMessages, res.data]);
            setMessageContent('');
            setFile(null);
            setFilePreview(null);
            scrollToBottom();
          }
        });
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="text-white flex-col  relative max-h-screen">
      <div className="backdrop-blur-xl  flex  justify-between items-center px-6 h-[7vh]">
        <span className="flex items-center">
          <img
            className="h-12 w-12 rounded-full mr-3 object-cover"
            src={
              props.activeConv.user.profil_pic
                ? props.activeConv.user.profil_pic
                : defaultPp
            }
          />
          <p className="font-bold ">{props.activeConv.user.pseudo}</p>
        </span>
        <FontAwesomeIcon icon={faInfo} />
      </div>

      <ul
        className={`px-6 overflow-y-auto ${
          filePreview
            ? 'min-h-[70vh] max-h-[70vh]'
            : 'min-h-[86vh] max-h-[86vh]'
        } `}
      >
        {allMessages.map((message) => (
          <li
            key={message.id}
            className={`flex ${
              message.author.id === user.id ? 'justify-end' : null
            } py-6  w-full text-left w-full px-3 py-2 rounded-[10px]`}
          >
            <div
              className={`${
                message.author.id === user.id ? 'bg-[#1D9BF0]' : 'bg-slate-900'
              } w-fit text-left max-w-[50%] px-3 py-2 rounded-[10px]`}
            >
              {message.media_url && (
                <>
                  {message.media_url.includes('.mp4') ||
                  message.media_url.includes('.webm') ? (
                    <video
                      src={message.media_url}
                      controls
                      className="my-3 rounded-lg"
                    />
                  ) : (
                    <img src={message.media_url} className="my-3 rounded-lg" />
                  )}
                </>
              )}
              <p className=" ">{message.content}</p>
            </div>
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>
      <div
        className={`${
          filePreview ? 'h-[23vh]' : 'h-[7vh]'
        } flex items-center border-t-[1px] border-slate-700 `}
      >
        {filePreview ? (
          <form className="w-[95%] max-h-[23vh] flex flex-col justify-between py-1 h-full mx-auto">
            <div className="w-full flex items-center justify-between mb-2 max-h-[16vh]">
              <span
                className="h-full relative cursor-pointer"
                onClick={() => {
                  setFile(null);
                  setFilePreview(null);
                }}
              >
                <img src={filePreview} className="h-full rounded" />
                <span className="absolute right-0 top-0 h-6 w-6 flex justify-center items-center rounded-full bg-slate-500/50">
                  <FontAwesomeIcon icon={faX} className="" />
                </span>
              </span>

              <FontAwesomeIcon
                icon={faPaperPlane}
                className="text-[#1C9AF0] cursor-pointer"
                onClick={() => postMessageHandler()}
              />
            </div>
            <input
              type="text"
              className="w-full bg-transparent bg-search pl-3 rounded-full py-3  outline-0"
              placeholder="Démarrer un nouveau message"
              onChange={(e) => setMessageContent(e.target.value)}
              value={messageContent}
            />
          </form>
        ) : (
          <form
            className="w-[95%] flex items-center justify-between bg-search rounded-2xl px-4  mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              postMessageHandler();
            }}
          >
            <span className="flex items-center text-[#1C9AF0]">
              <div className="flex items-center mr-4">
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
              <FontAwesomeIcon icon={faFilm} className="mr-4 cursor-pointer" />
              <FontAwesomeIcon icon={faSmile} className="cursor-pointer" />
            </span>
            <input
              type="text"
              className="w-full mx-4 bg-transparent rounded-full py-3 pl-4 outline-0"
              placeholder="Démarrer un nouveau message"
              onChange={(e) => setMessageContent(e.target.value)}
              value={messageContent}
            />
            <button type="submit">
              {' '}
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="text-[#1C9AF0] cursor-pointer"
              />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MessageText;
