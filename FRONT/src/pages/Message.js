import React, { useEffect, useState } from 'react';
import MessageConversation from '../components/layout/MessageConversation';
import MessageText from '../components/layout/MessageText';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Message = (props) => {
  const user = useSelector((state) => state);
  const [activeConv, setActiveConv] = useState(null);

  return (
    <div className="h-screen flex">
      <div className="w-[450px] min-h-[100vh] bg-black border-r-[1px] border-slate-700">
        <MessageConversation
          setActiveConv={setActiveConv}
          setNewConvBox={props.setNewConvBox}
        />
      </div>
      {activeConv ? (
        <div className="w-[600px] min-h-[100vh] bg-black border-r-[1px] border-slate-700">
          <MessageText activeConv={activeConv} />
        </div>
      ) : null}
    </div>
  );
};

export default Message;
