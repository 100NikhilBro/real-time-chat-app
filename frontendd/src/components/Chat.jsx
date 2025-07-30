import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useAccessChat } from '../hooks/useAccessChat';
import { useMessages, useSendMessage } from '../hooks/useMessage';
import Message from './Message';
import { useSocket } from '../context/socketContext';
import { useCurrentUser } from '../hooks/useCurrentUser';
import '../css/scroll.css'


const Chat = ({ selectedUser, onBack }) => {
  const { data: currentUser } = useCurrentUser();
  const { mutate: accessChat, isPending: chatLoading } = useAccessChat();
  const { mutate: sendMessage, isPending: sending } = useSendMessage();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const { data: initialMessages, isLoading: messagesLoading } = useMessages(chatId);
  const socket = useSocket();
  const scrollRef = useRef(null);



  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };



  useEffect(() => {
    if (selectedUser?._id) {
      accessChat(selectedUser._id, {
        onSuccess: (data) => {
          setChatId(data._id);
          socket.emit('join-chat', data._id);
        },
      });
    }
  }, [selectedUser]);

  

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);



  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  useEffect(() => {
    if (!socket || !chatId) return;

    const handleNewMessage = (message) => {
      if (message.chat === chatId || message.chat?._id === chatId) {
        setMessages((prev) => {
          const exists = prev.some((msg) => msg._id === message._id);
          return exists ? prev : [...prev, message];
        });
      }
    };

    socket.on('new-message', handleNewMessage);
    return () => socket.off('new-message', handleNewMessage);
  }, [socket, chatId]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content && !file) return;

    const payload = {
      chatId,
      content,
    };

    sendMessage(payload, {
      onSuccess: (newMessage) => {
        setContent('');
        setFile(null);
        scrollToBottom();

        socket.emit('send-message', {
          ...newMessage,
          chat: chatId,
        });
      },
    });
  };

  if (chatLoading || messagesLoading) {
    return (
      <div className="flex items-center justify-center h-full text-lg text-gray-400">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-0 relative hide-scrollbar">
      <div className="flex items-center gap-2 p-4 md:p-6 text-lg font-semibold text-gray-200 border-b border-gray-800 ">
        <button
          onClick={onBack}
          className="p-1 rounded hover:bg-gray-800 transition"
        >
          <ArrowLeft size={22} />
        </button>
        <span className="text-purple-400">Chat with {selectedUser?.name}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 md:px-6 bg-[#161B22]  hide-scrollbar">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <Message key={msg._id} message={msg} currentUser={currentUser} />
          ))
        ) : (
          <div className="text-gray-400 text-center">No messages yet</div>
        )}
        <div ref={scrollRef} />
      </div>

   
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 w-full bg-[#0D1117] p-4 flex items-center gap-2 border-t border-gray-800"
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-600 bg-[#0D1117] text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          type="submit"
          disabled={sending}
          className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
