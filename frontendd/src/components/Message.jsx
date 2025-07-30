import React from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import '../css/scroll.css';

const Message = ({ message }) => {
  const { data: user } = useCurrentUser();
  const isSender = message?.sender?._id === user?._id;

  const senderName = message?.sender?.name?.split(' ')[0];

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} px-4 my-2 hide-scrollbar`}>
      <div className="flex flex-col items-start max-w-[75%]">
        <div
          className={`px-4 py-2 text-sm rounded-2xl shadow-sm break-words whitespace-pre-wrap
            ${isSender
              ? 'bg-gradient-to-br from-[#7F56D9] to-[#6241C6] text-white rounded-br-none self-end'
              : 'bg-[#F2F3F5] text-gray-800 rounded-bl-none border border-gray-200'
            }`}
        >
          {message.content}

         

        </div>

    
        <span className={`text-[10px] mt-1 ${isSender ? 'self-end text-gray-300' : 'text-gray-500'}`}>
          {isSender ? 'You' : senderName}
        </span>
      </div>
    </div>
  );
};

export default Message;
