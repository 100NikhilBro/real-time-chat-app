import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import UserList from '../components/userList';
import Chat from '../components/Chat';

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBack = () => setSelectedUser(null);

  return (
    <div className="flex h-screen w-full bg-[#0D1117] flex-col md:flex-row">
      
      {/* Show User List if desktop or mobile with no user selected */}
      {(!isMobile || !selectedUser) && (
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-800"
        >
          <UserList onUserSelect={(user) => setSelectedUser(user)} />
        </motion.div>
      )}

      {/* Chat Section */}
      <div className="flex-1 relative">
        {selectedUser ? (
          <Chat selectedUser={selectedUser} onBack={handleBack} />
        ) : (
          !isMobile && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-[#1E1E2F] via-[#12151C] to-[#0A0C11]">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <MessageSquare className="w-16 h-16 text-purple-400 mb-4" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-xl font-semibold text-gray-300"
              >
                Click on a user to start chatting 💬
              </motion.p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ChatPage;




