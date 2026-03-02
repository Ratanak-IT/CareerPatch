// src/routes/ProfileRouter.jsx
import { useSelector } from 'react-redux'
import { selectIsAuthed, selectAuthUser } from '../features/auth/authSlice.js'
import { useMeQuery } from '../services/authApi.js'
import LoginPage from '../pages/Login.jsx'
import ProfileFreelancer from '../pages/ProfileFreelancer.jsx'
import ProfileBusinessPage from '../pages/ProfileBusiness.jsx'

export default function ProfileRouter() {
  const isAuthed = useSelector(selectIsAuthed)
  const authUser = useSelector(selectAuthUser)

  const { data: meRes, isLoading } = useMeQuery(undefined, { skip: !isAuthed })

  if (!isAuthed) return <LoginPage />

  const userFromMe = meRes?.data ?? meRes
  const user       = authUser || userFromMe

  if (!user && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-9 h-9 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const userType = user?.userType || ''

  if (userType === 'BUSINESS_OWNER') {
    return <ProfileBusinessPage />
  }

  return <ProfileFreelancer />
}