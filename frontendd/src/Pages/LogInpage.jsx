import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import userInstannce from '../axiosInstance/userInstance'
import { LogIn, UserPlus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'


const loginUser = async (credentials) => {
  const { data } = await userInstannce.post('/login', credentials)
  return data
}

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate()


  const {
    mutate: login,
    isPending
  } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Save token to localStorage
      localStorage.setItem('zapchat_token', data.token);
      // important step hai yeh -> aange chats ke liye wrna contex yaa redux use krna padgea  -> imporant step
      localStorage.setItem('zapchat_user', JSON.stringify(data.user))   
      //  Success toast & reset form
      toast.success('Login successful!')
      setFormData({ email: '', password: '' })

      //  Navigate to profile
      navigate('/profile')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Login failed!')
    }
  })

  
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    login(formData)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1c] via-[#12172a] to-[#0a0f1c] text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 rounded-xl shadow-xl bg-[#1e1e2f] space-y-5"
      >
        {/*  Heading */}
        <div className="text-center">
          <LogIn className="mx-auto mb-2 text-[#7cff8e]" size={32} />
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-sm text-gray-400">Securely login to continue chatting</p>
        </div>

        {/* Email Field */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-[#2c2f4a] focus:outline-none focus:ring-2 focus:ring-[#7cff8e] transition"
        />

        {/*  Password Field */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-[#2c2f4a] focus:outline-none focus:ring-2 focus:ring-[#7cff8e] transition"
        />

        {/* Login Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 rounded-full font-semibold bg-gradient-to-r from-[#7cff8e] to-[#00e3e3] hover:from-[#8dffc1] hover:to-[#32f5f5] text-[#0a0f1c] transition-all duration-300 hover:scale-[1.03]"
        >
          {isPending ? 'Logging in...' : 'Login'}
        </button>

        {/*  Link to SignUp */}
        <div className="text-center pt-2 text-sm text-gray-400">
          New here?
          <Link to="/sign" className="text-[#7cff8e] hover:underline inline-flex items-center gap-1 ml-1">
            <UserPlus size={16} /> Sign Up
          </Link>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
