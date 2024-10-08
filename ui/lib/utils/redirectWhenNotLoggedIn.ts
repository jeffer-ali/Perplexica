import { getUserByToken } from '@/lib/auth/firebase-admin'
import { redirect } from 'next/navigation'

export default async function redirectWhenNotLoggedIn() {
  const user = await getUserByToken()
  if (user.uid === 'anonymous') {
    redirect('/')
  }
}
