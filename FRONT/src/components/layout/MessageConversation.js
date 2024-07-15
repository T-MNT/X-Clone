import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatDate } from '../../utils/tweetFunctions';
import defaultPp from '../../assets/img/goku_sticker.png';

const MessageConversation = (props) => {
  const user = useSelector((state) => state);

  const [allConversations, setAllConversations] = useState([]);

  ///Récupère les conversation du user et les attribue au state
  useEffect(() => {
    if (user.id) {
      axios
        .post('https://127.0.0.1:8000/conversation/get', { id: user.id })
        .then((res) => {
          if (res.status === 200) {
            let conversations = res.data.map((conv) => {
              if (conv.user1.id == user.id) {
                let user = conv.user2;
                return {
                  id: conv.id,
                  user: user,
                  date: conv.date,
                  messages: conv.messages,
                };
              } else {
                let user = conv.user1;
                return {
                  id: conv.id,
                  user: user,
                  date: conv.date,
                  messages: conv.messages,
                };
              }
            });

            console.log(conversations);
            setAllConversations(conversations);
          }
        });
    }
  }, [user]);

  return (
    <div className="text-white">
      <div className="w-full flex items-center justify-between px-6 pt-3 mb-6">
        <h4 className="font-bold text-xl ">Messages</h4>
        <span
          className="flex items-center p-2 rounded-full hover-bg cursor-pointer "
          onClick={() => props.setNewConvBox(true)}
        >
          <FontAwesomeIcon icon={faEnvelope} />
        </span>
      </div>
      <div className="px-6 mb-6">
        <input
          className="w-full border-[1px] bg-transparent border-slate-700 rounded-full px-6 py-2 text-slate-400"
          placeholder="Cherchez dans les messages privés"
        />
      </div>
      <div>
        <ul className=" pt-3">
          {allConversations.map((conv) => (
            <li
              className="flex w-full items-center py-4 cursor-pointer hover-bg"
              onClick={() => props.setActiveConv(conv)}
            >
              <div className="px-6 w-full flex">
                <img
                  className="h-12 w-12 rounded-full mr-3 object-cover"
                  src={conv.user.profil_pic ? conv.user.profil_pic : defaultPp}
                />
                <div className="w-[90%] pr-6">
                  <span className="flex text-slate-800">
                    <p className="font-bold text-white mr-1">
                      {conv.user.pseudo}
                    </p>
                    <p className="text-slate-600 mr-3">{conv.user.username}</p>
                    <p className="text-slate-600">
                      {formatDate(conv.date.split(' ')[0])}
                    </p>
                  </span>
                  <span className="text-slate-400 overflow-hidden w-full">
                    <p className="truncate text-left">
                      {conv.messages[conv.messages.length - 1].content}
                    </p>
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MessageConversation;
