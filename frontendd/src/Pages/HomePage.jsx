import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Sparkles, LogIn, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <main className="h-screen overflow-hidden bg-[#0a0f1c] text-white flex items-center justify-center px-4 sm:px-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center w-full max-w-3xl py-10 sm:py-12 md:py-16"
      >
        {/* Icon + Title */}
        <div className="flex justify-center items-center gap-4 mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 100 }}
            className="p-4 rounded-full bg-gradient-to-tr from-[#7cff8e] to-[#00e3e3] shadow-lg"
          >
            <MessageCircle size={40} className="text-[#0a0f1c]" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-[#facc15] via-[#7cff8e] to-[#00e3e3] bg-clip-text text-transparent">
            ZapChat
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-[#a5aab7] text-lg sm:text-xl md:text-2xl font-medium mb-12 flex justify-center items-center gap-2">
          <Sparkles className="text-[#7cff8e]" size={20} />
          Your space to talk and transfer.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
          <Link to="/sign" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#7cff8e] hover:bg-[#8dffc1] text-[#0a0f1c] font-semibold py-2.5 px-6 rounded-full shadow-md transition-all duration-300 hover:scale-105">
              <UserPlus size={18} /> Sign Up
            </button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#facc15] hover:bg-[#facc15] hover:text-[#0a0f1c] text-[#facc15] font-semibold py-2.5 px-6 rounded-full shadow-md transition-all duration-300 hover:scale-105">
              <LogIn size={18} /> Login
            </button>
          </Link>
        </div>
      </motion.div>
    </main>
  )
}

export default HomePage
