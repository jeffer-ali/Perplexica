'use client'
import { useState } from 'react'
import { FirebaseAuthForm, PAGE_STATE } from '@/components/FirebaseAuthForm'
import { FirebaseProvider } from '@/components/FirebaseProvider'
import { message } from 'antd'
import { useRouter, usePathname } from 'next/navigation'
import firebaseConfig from '@/lib/auth/config.json'
import { useTranslations } from 'use-intl'

interface LoginProps {
  theme?: string
  darkMainColor?: string
  locale?: string
}

async function tokenVerification(
  token: string,
  options?: { [key: string]: any }
) {
  return fetch(`/api/verifyToken`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    ...(options || {})
  })
}

// const agreements = {
//   terms: '/terms',
//   privacy: '/privacy'
// }
// pageState, thirdPartyLoginConfig, isError, onThirdPartyLoginSuccess, onThirdPartyLoginError, onLoginSuccess, onLoginError, onSignupSuccess, onSignupError, onLinkToForgotPassword, onLinkToLogin, onLinkToSignup, handleInviteCodeVerify, verifyInviteCodeLoading, logo, agreements, thirdPartyLoginPlatforms,
const Login = (props: LoginProps) => {
  const { theme, darkMainColor, locale } = props
  const pathname = usePathname()
  const t = useTranslations()
  let initialState
  switch (pathname) {
    case '/send-verification-email':
      initialState = PAGE_STATE.SEND_VERIFICATION_EMAIL
      break
    default:
      initialState = PAGE_STATE.SIGN_IN
      break
  }
  const [currentState, setCurrentState] = useState<string>(initialState)
  const router = useRouter()

  return (
    <div
      className={
        'flex items-center justify-center bg-white max-md:h-screen max-md:dark:bg-mobile-login'
      }
    >
      <FirebaseProvider
        config={firebaseConfig}
        tokenVerification={tokenVerification}
      >
        <FirebaseAuthForm
          pageState={currentState}
          theme={theme}
          locale={locale}
          darkMainColor={darkMainColor}
          // pageState={"signup"}
          logo={
            'https://img.alicdn.com/imgextra/i2/O1CN01qlsElj1hB3UPLJhrz_!!6000000004238-2-tps-312-120.png'
          }
          thirdPartyLoginPlatforms={['google']}
          onLinkToForgotPassword={() => {
            setCurrentState(PAGE_STATE.RESET_PASSWORD)
          }}
          // agreements={agreements}
          onLinkToSignup={() => {
            setCurrentState(PAGE_STATE.SIGN_UP)
          }}
          onThirdPartyLoginSuccess={async data => {
            await fetch('/api/bindAnonymousToken', { method: 'POST' })
            window.location.reload()
          }}
          onThirdPartyLoginError={err => {
            console.log('ThirdPartyLoginError', err)
          }}
          onLoginSuccess={async data => {
            await fetch('/api/bindAnonymousToken', { method: 'POST' })
            window.location.reload()
          }}
          onLoginError={err => {
            console.log('onLoginError', err)
          }}
          onSignupSuccess={async () => {
            message.warning(t('xanswer.signUpSuccessTip'))
            await fetch('/api/bindAnonymousToken', { method: 'POST' })
            setCurrentState(PAGE_STATE.SIGN_IN)
          }}
          onSignupError={err => {
            console.log('onSignupError', err)
          }}
          onLinkToLogin={() => {
            setCurrentState(PAGE_STATE.SIGN_IN)
          }}
          onSendEmailSuccess={() => {
            setCurrentState(PAGE_STATE.SIGN_IN)
          }}
          onLinkToVerifyEmail={() => {
            setCurrentState(PAGE_STATE.SEND_VERIFICATION_EMAIL)
          }}
        />
      </FirebaseProvider>
    </div>
  )
}

export default Login
