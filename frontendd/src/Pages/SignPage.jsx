import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import userInstannce from '../axiosInstance/userInstance'
import { toast } from 'sonner'
import { UserPlus, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'

const signupUser = async (userData) => {
  const { data } = await userInstannce.post('/register', userData)
  return data
}

const SignPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const {
    mutate: signup,
    isPending
  } = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      toast.success("Account created successfully!")
      setFormData({ name: '', email: '', password: '' })
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Signup failed!")
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
    signup(formData)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1c] via-[#12172a] to-[#0a0f1c] text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 rounded-xl shadow-xl bg-[#1e1e2f] space-y-5"
      >
        <div className="text-center">
          <UserPlus className="mx-auto mb-2 text-[#7cff8e]" size={32} />
          <h2 className="text-2xl font-bold">Create your ZapChat account</h2>
          <p className="text-sm text-gray-400">Connect. Share. Chat.</p>
        </div>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-[#2c2f4a] focus:outline-none focus:ring-2 focus:ring-[#7cff8e] transition"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-[#2c2f4a] focus:outline-none focus:ring-2 focus:ring-[#7cff8e] transition"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-[#2c2f4a] focus:outline-none focus:ring-2 focus:ring-[#7cff8e] transition"
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 rounded-full font-semibold bg-gradient-to-r from-[#7cff8e] to-[#00e3e3] hover:from-[#8dffc1] hover:to-[#32f5f5] text-[#0a0f1c] transition-all duration-300 hover:scale-[1.03]"
        >
          {isPending ? 'Signing up...' : 'Sign Up'}
        </button>

        <div className="text-center pt-2 text-sm text-gray-400">
          Already registered?
          <Link to="/login" className="text-[#7cff8e] hover:underline inline-flex items-center gap-1 ml-1">
            <LogIn size={16} /> Login
          </Link>
        </div>
      </form>
    </div>
  )
}

export default SignPage
