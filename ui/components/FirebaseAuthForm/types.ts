export interface FooterProps {
  pageState: string
  handldResetPassword: () => void
  handleVerifyEmail: () => void
  handleVerifyInviteCode: () => void
  sendVerificationEmailLoading: boolean
  sendResetPasswordEmailLoading: boolean
  verifyInviteCodeLoading?: boolean
  onLinkToLogin?: () => void
  onLinkToSignup?: () => void
  theme?: string
  darkMainColor?: string
}

export interface ThirdPartyLoginConfigType {
  platform: string
  key: string
  logo: string
}

export interface AuthProps {
  pageState?: string
  thirdPartyLoginConfig?: ThirdPartyLoginConfigType[]
  isError?: boolean
  onThirdPartyLoginSuccess?: (data: any) => void
  onThirdPartyLoginError?: (error: Error, param: any[]) => void
  onLoginSuccess?: (data: any) => void
  onLoginError?: (error: Error, param: any[]) => void
  onSignupSuccess?: (data: any) => void
  onSignupError?: (error: Error, param: any[]) => void
  onLinkToForgotPassword?: () => void
  onLinkToLogin?: () => void
  onLinkToSignup?: () => void
  handleInviteCodeVerify?: (params?: any) => void
  verifyInviteCodeLoading?: boolean
  firebaseConfig?: any
  logo: string
  agreements?: {
    privacy: string
    term: string
  }
  thirdPartyLoginPlatforms?: string[]
  theme?: string
  darkMainColor?: string
  locale?: string
  onSendEmailSuccess?: () => void
  onLinkToVerifyEmail?: () => void
}
