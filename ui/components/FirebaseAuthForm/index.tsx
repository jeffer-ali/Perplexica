import { QuestionCircleOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Alert, Button, Checkbox, Divider, Input, message, Tooltip } from 'antd'
import cl from 'classnames'
import { SetStateAction, useEffect, useMemo, useState } from 'react'
import { IntlProvider, useTranslations } from 'use-intl'
import { useFirebase } from '../FirebaseProvider'
import { Footer } from './component/Footer'
import { availableThirdPartyLoginConfig } from './constants'
import styles from './index.module.css'
import { AuthProps, ThirdPartyLoginConfigType } from './types'
import { en } from './locales/en-US'
import { zh } from './locales/zh-CN'

export const PAGE_STATE = {
  SIGN_IN: 'signin',
  SIGN_UP: 'signup',
  RESET_PASSWORD: 'reset-password',
  SEND_VERIFICATION_EMAIL: 'send-verification-email',
  INVITE: 'invite'
}

export const FirebaseAuthFormComponent = ({
  pageState = PAGE_STATE.SIGN_IN,
  thirdPartyLoginConfig = availableThirdPartyLoginConfig,
  isError = false,
  onThirdPartyLoginSuccess,
  onThirdPartyLoginError,
  onLoginSuccess,
  onLoginError,
  onSignupSuccess,
  onSignupError,
  onLinkToForgotPassword,
  onLinkToLogin,
  onLinkToSignup,
  handleInviteCodeVerify,
  verifyInviteCodeLoading,
  logo,
  agreements,
  thirdPartyLoginPlatforms,
  theme = 'light',
  darkMainColor = '#FF2E4D',
  onSendEmailSuccess,
  onLinkToVerifyEmail
}: AuthProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [checkAgreements, setCheckAgreements] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [resetPasswordTimer, setResetPasswordTimer] =
    useState<NodeJS.Timeout | null>(null)

  const [_, contextHolder] = message.useMessage()

  const t = useTranslations()

  const {
    handleSignInWithGithub,
    handleSignInWithGoogle,
    handleSignInWithFacebook,
    handleSignInWithOtherProvider,
    logInWithEmailAndPassword,
    sendResetPasswordEmail,
    sendVerificationEmail,
    signUpWithEmailAndPassword
  } = useFirebase()
  useEffect(() => {
    // 获取存储的错误信息
    const tokenError = localStorage.getItem('superITokenError')
    if (tokenError) {
      // 展示错误信息
      message.error(tokenError)
      // 清除存储的错误信息以避免再次展示
      localStorage.removeItem('superITokenError')
    }
  }, [])

  useEffect(() => {
    return () => {
      if (resetPasswordTimer) {
        clearTimeout(resetPasswordTimer)
      }
    }
  }, [resetPasswordTimer])

  const handleEmailChange = (e: {
    target: { value: SetStateAction<string> }
  }) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: {
    target: { value: SetStateAction<string> }
  }) => {
    setPassword(e.target.value)
  }

  const handleConfirmPasswordChange = (e: {
    target: { value: SetStateAction<string> }
  }) => {
    setConfirmPassword(e.target.value)
  }

  const hanldeInviteCodeChange = (e: {
    target: { value: SetStateAction<string> }
  }) => {
    setInviteCode(e.target.value)
  }

  const handleAgreementsCheck = (e: {
    target: { checked: boolean | ((prevState: boolean) => boolean) }
  }) => {
    setCheckAgreements(e.target.checked)
  }

  const {
    loading: handleSignInWithGoogleLoading,
    run: runHandleSignInWithGoogle
  } = useRequest(handleSignInWithGoogle, {
    manual: true,
    onSuccess: data => {
      message.success(t('login.loginSuccessfullyTip'))
      onThirdPartyLoginSuccess?.(data)
    },
    onError: (error, params) => {
      message.error(error.message)
      onThirdPartyLoginError?.(error, params)
    }
  })

  const {
    loading: handleSignInWithGithubLoading,
    run: runHandleSignInWithGithub
  } = useRequest(handleSignInWithGithub, {
    manual: true,
    onSuccess: data => {
      message.success(t('login.loginSuccessfullyTip'))
      onThirdPartyLoginSuccess?.(data)
    },
    onError: (error, params) => {
      message.error(error.message)
      onThirdPartyLoginError?.(error, params)
    }
  })

  const {
    loading: handleSignInWithFacebookLoading,
    run: runHandleSignInWithFacebook
  } = useRequest(handleSignInWithFacebook, {
    manual: true,
    onSuccess: data => {
      message.success(t('login.loginSuccessfullyTip'))
      onThirdPartyLoginSuccess?.(data)
    },
    onError: (error, params) => {
      message.error(error.message)
      onThirdPartyLoginError?.(error, params)
    }
  })

  const {
    loading: signUpWithEmailAndPasswordLoading,
    run: runSignUpWithEmailAndPassword
  } = useRequest(signUpWithEmailAndPassword, {
    manual: true,
    onSuccess: data => {
      // message.success('Sign up successfully!');
      // message.info('Please check your email to verify your account.', 10);
      onSignupSuccess?.(data)
    },
    onError: (error, params) => {
      if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
        message.error(t('login.errorTipOfEmail'))
      }
      onSignupError?.(error, params)
    }
  })

  const {
    loading: logInWithEmailAndPasswordLoading,
    run: runLogInWithEmailAndPassword
  } = useRequest(logInWithEmailAndPassword, {
    manual: true,
    onSuccess: data => {
      message.success(t('login.loginSuccessfullyTip'))
      onLoginSuccess?.(data)
    },
    onError: (error, params) => {
      if (error.message === 'Firebase: Error (auth/invalid-email).') {
        message.error(t('login.invalidEmail'))
      } else if (
        error.message === 'Firebase: Error (auth/invalid-login-credentials).'
      ) {
        message.error(t('login.wrongPassword'))
      } else if (
        error.message === 'Email not verified. Please verify your email.'
      ) {
        message.error(error.message, 5)
        onLinkToVerifyEmail?.()
      } else if (
        error.message === 'Firebase: Error (auth/invalid-credential).'
      ) {
        message.error(t('login.errorEmailOrPassword'))
      } else {
        message.error(error.message)
      }
      onLoginError?.(error, params)
    }
  })

  const {
    run: runSendResetPasswordEmail,
    loading: sendResetPasswordEmailLoading
  } = useRequest(sendResetPasswordEmail, {
    manual: true,
    onSuccess: () => {
      message.success(t('login.emailSentTip'), 5)
      const timeoutId = setTimeout(() => {
        onSendEmailSuccess?.()
      }, 5000)
      setResetPasswordTimer(timeoutId)
    }
  })

  const {
    run: runSendVerificationEmail,
    loading: sendVerificationEmailLoading
  } = useRequest(sendVerificationEmail, {
    manual: true,
    onSuccess: () => {
      message.success(t('login.emailSentTip'), 5)
      const timeoutId = setTimeout(() => {
        onSendEmailSuccess?.()
      }, 5000)
      setResetPasswordTimer(timeoutId)
    }
  })

  const handleSignUpWithEmailAndPassword = () => {
    //包含一个@符号，以及至少一个域名和一个顶级域名，且不包含空格
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      message.error(t('login.emailRequiredTip'))
    } else if (!emailRegex.test(email)) {
      message.error(t('login.invalidEmail'))
    } else if (!password) {
      message.error(t('login.passwordRequiredTip'))
    } else if (!confirmPassword) {
      message.error(t('login.errorTipOfConfirmPassword'))
    }
    // else if (agreements && !checkAgreements) {
    //   message.error('Please agree to the terms of use and privacy policy')
    // }
    else if (password !== confirmPassword) {
      message.error(t('login.errorTipOfSamePassword'))
    } else if (
      password.length < 6 ||
      password.length > 50 ||
      /[\x3C\x3E\x21]/.test(password)
    ) {
      message.error(t('login.errorTipOfCharacters'))
    } else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      message.error(t('login.passwordTip'))
    } else {
      runSignUpWithEmailAndPassword(email, password)
    }
  }

  const handleLogInWithEmailAndPassword = () => {
    if (!email) {
      message.error(t('login.emailPlaceholder'))
    } else if (!password) {
      message.error(t('login.passwordPlaceholder'))
    } else {
      runLogInWithEmailAndPassword(email, password)
    }
  }

  const handleThirdpartyLogin = (config: ThirdPartyLoginConfigType) => {
    if (isError) {
      handleSignInWithOtherProvider(
        config.key as 'google' | 'github' | 'facebook'
      )
    } else if (config.key === 'google') {
      runHandleSignInWithGoogle()
    } else if (config.key === 'github') {
      runHandleSignInWithGithub()
    } else if (config.key === 'facebook') {
      runHandleSignInWithFacebook()
    }
  }

  const handldResetPassword = () => {
    runSendResetPasswordEmail(email)
  }

  const handleVerifyEmail = () => {
    runSendVerificationEmail()
  }

  const handleVerifyInviteCode = () => {
    handleInviteCodeVerify?.()
  }

  const handleKeyPress = (e: any, pageState: string) => {
    if (e.key === 'Enter') {
      switch (pageState) {
        case PAGE_STATE.SIGN_IN:
          if (email && password) {
            handleLogInWithEmailAndPassword()
          }
          break
        case PAGE_STATE.SIGN_UP:
          if (email && password && confirmPassword) {
            handleSignUpWithEmailAndPassword()
          }
          break
        case PAGE_STATE.RESET_PASSWORD:
          if (email) {
            handldResetPassword()
          }
          break
        case PAGE_STATE.SEND_VERIFICATION_EMAIL:
          if (email) {
            handleVerifyEmail()
          }
          break
        case PAGE_STATE.INVITE:
          if (inviteCode) {
            handleVerifyInviteCode()
          }
          break
        default:
          break
      }
    }
  }

  const getAuthContent = (pageState: string) => {
    switch (pageState) {
      case PAGE_STATE.RESET_PASSWORD:
        return {
          subtitle: t('login.subTitle'),
          label: '',
          placeholder: t('login.emailPlaceholder'),
          value: email,
          handleChange: handleEmailChange
        }
      case PAGE_STATE.SEND_VERIFICATION_EMAIL:
        return {
          subtitle: t('login.verifyEmailTip'),
          label: '',
          placeholder: t('login.emailPlaceholder'),
          value: email,
          handleChange: handleEmailChange
        }
      case PAGE_STATE.INVITE:
        return {
          subtitle: '',
          label: 'Code',
          placeholder: 'Please enter invite code',
          value: inviteCode,
          handleChange: hanldeInviteCodeChange
        }
      default:
        return
    }
  }

  const getThirdPartyLoginLoading = (platform: string) => {
    switch (platform) {
      case 'Google':
        return handleSignInWithGoogleLoading
      case 'Github':
        return handleSignInWithGithubLoading
      case 'Facebook':
        return handleSignInWithFacebookLoading
      default:
        return false
    }
  }

  return (
    <div className={styles.wrapper}>
      {contextHolder}
      {isError && (
        <Alert
          message="Error"
          description={t('login.errorTip')}
          type="error"
          showIcon
          closable
          className={styles.alert}
        />
      )}
      <div
        className={cl(theme === 'dark' ? styles.darkloginContainer : '', {
          [styles.loginContainer]: ![
            PAGE_STATE.RESET_PASSWORD,
            PAGE_STATE.SEND_VERIFICATION_EMAIL,
            PAGE_STATE.INVITE
          ].includes(pageState),
          [styles.resetPasswordContainer]: [
            PAGE_STATE.RESET_PASSWORD,
            PAGE_STATE.SEND_VERIFICATION_EMAIL,
            PAGE_STATE.INVITE
          ].includes(pageState)
        })}
        style={{
          backgroundColor:
            theme === 'dark' && window.innerWidth < 768
              ? 'rgba(10, 10, 10, 1)'
              : ''
        }}
      >
        {/* <div className={styles.logo}><img src={logo} alt="logo" /></div> */}
        <div
          className={cl(
            styles.loginTitle,
            pageState === PAGE_STATE.SIGN_UP ? styles.loginTitleCls : '',
            theme === 'dark' ? styles.darkLoginTitle : '',
            {
              [styles.loginTitleCls]: [
                PAGE_STATE.RESET_PASSWORD,
                PAGE_STATE.SEND_VERIFICATION_EMAIL,
                PAGE_STATE.INVITE
              ].includes(pageState)
            }
          )}
        >
          {[PAGE_STATE.RESET_PASSWORD].includes(pageState)
            ? t('login.resetpasswordTitle')
            : [PAGE_STATE.SEND_VERIFICATION_EMAIL].includes(pageState)
            ? t('login.verifyEmailTitle')
            : t('login.logInTitle')}
        </div>
        {[
          PAGE_STATE.RESET_PASSWORD,
          PAGE_STATE.SEND_VERIFICATION_EMAIL,
          PAGE_STATE.INVITE
        ].includes(pageState) ? (
          <>
            <div
              className={cl(
                styles.subtitle,
                theme === 'dark' ? styles.darkSubtitle : ''
              )}
            >
              {getAuthContent(pageState)?.subtitle}
            </div>
            {getAuthContent(pageState)?.label ? (
              <div className={styles.label}>
                {getAuthContent(pageState)?.label}
              </div>
            ) : null}
            <Input
              className={cl(
                styles.authInput,
                theme === 'dark' ? styles.darkAuthInput : ''
              )}
              value={getAuthContent(pageState)?.value}
              onChange={getAuthContent(pageState)?.handleChange}
              onKeyDown={e => handleKeyPress(e, pageState)}
              placeholder={getAuthContent(pageState)?.placeholder}
            />
          </>
        ) : (
          <>
            {thirdPartyLoginPlatforms?.length &&
            pageState === PAGE_STATE.SIGN_IN ? (
              <>
                <div className={styles.thirdPartyLoginContainer}>
                  {thirdPartyLoginConfig.map((config, index) => {
                    if (thirdPartyLoginPlatforms.includes(config.key)) {
                      return (
                        <>
                          <Button
                            className={cl(
                              styles.thirdPartyItem,
                              theme === 'dark' ? styles.darkThirdPartyLabel : ''
                            )}
                            key={index}
                            onClick={() => handleThirdpartyLogin(config)}
                            loading={getThirdPartyLoginLoading(config.key)}
                          >
                            <div
                              className={styles.thirdPartyIcon}
                              style={
                                config.platform === 'Google'
                                  ? {}
                                  : { transform: 'scale(1.4)' }
                              }
                            >
                              <img
                                src={config.logo}
                                alt={config.platform}
                                className={styles.imgCls}
                              />
                            </div>
                            <div className={styles.thirdPartyLabel}>
                              {t('login.loginPlatform', {
                                platform: config.platform
                              })}
                            </div>
                          </Button>
                          <div
                            className={cl(
                              styles.loginAgreement,
                              theme === 'dark' ? styles.darkLoginAgreement : ''
                            )}
                          >
                            {t('login.loginTip')}{' '}
                            <a
                              href={agreements?.privacy}
                              className={styles.link}
                            >
                              {t('login.privacyPolicy')}
                            </a>{' '}
                            {t('login.haveRead')}{' '}
                            <a href={agreements?.term} className={styles.link}>
                              {t('login.termsOfUse')}
                            </a>
                          </div>
                        </>
                      )
                    } else {
                      return null
                    }
                  })}
                </div>
                <Divider
                  plain
                  className={cl(
                    styles.divider,
                    theme === 'dark' ? styles.darkDivider : ''
                  )}
                >
                  {pageState === PAGE_STATE.SIGN_IN
                    ? t('login.otherSignInTip')
                    : t('login.otherSignUpTip')}
                </Divider>
              </>
            ) : null}
            <div
              className={styles.authForm}
              style={thirdPartyLoginPlatforms ? {} : { marginTop: 24 }}
            >
              <div>
                {/* <div className={styles.label}>Email</div> */}
                <Input
                  className={cl(
                    styles.authInput,
                    theme === 'dark' ? styles.darkAuthInput : ''
                  )}
                  value={email}
                  onChange={handleEmailChange}
                  placeholder={t('login.emailPlaceholder')}
                />
              </div>
              <div>
                <Input.Password
                  id="darkAuthInput"
                  className={cl(
                    styles.authInput,
                    theme === 'dark' ? styles.darkAuthInput : ''
                  )}
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyDown={e => handleKeyPress(e, pageState)}
                  placeholder={
                    pageState === PAGE_STATE.SIGN_IN
                      ? t('login.passwordPlaceholder')
                      : t('login.PasswordOtherPlaceholder')
                  }
                />
              </div>
              {pageState === PAGE_STATE.SIGN_UP && (
                <div className={styles.confirmPasswordWrapper}>
                  {/* <div className={styles.label}>Confirm Password</div> */}
                  <Input.Password
                    id={'confirmPasswordWrapper'}
                    className={cl(
                      styles.authInput,
                      theme === 'dark' ? styles.darkAuthInput : ''
                    )}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onKeyDown={e => handleKeyPress(e, pageState)}
                    placeholder={t('login.PasswordOtherPlaceholder')}
                  />
                </div>
              )}
              <div className={styles.contractWrapper}>
                {pageState === PAGE_STATE.SIGN_IN && (
                  <div
                    onClick={onLinkToForgotPassword}
                    className={cl(
                      styles.forgotPassword,
                      theme === 'dark' ? styles.darkForgotPassword : ''
                    )}
                  >
                    {t('login.forgotPassword')}
                  </div>
                )}
                {/* {pageState === PAGE_STATE.SIGN_UP && agreements ? (
                  <>
                    <Checkbox onChange={handleAgreementsCheck} />
                    <div>
                      By creating an account, you agree to Super.I’s{' '}
                      <a href={agreements?.term}>Terms of Use</a> and{' '}
                      <a href={agreements?.privacy}>Privacy Policy</a>
                    </div>
                  </>
                ) : null} */}
              </div>
            </div>
            <Button
              type="primary"
              className={styles.authButton}
              style={{
                backgroundColor: theme === 'dark' ? darkMainColor : '#222',
                color: '#fff'
              }}
              loading={
                pageState === PAGE_STATE.SIGN_IN
                  ? logInWithEmailAndPasswordLoading
                  : signUpWithEmailAndPasswordLoading
              }
              onClick={
                pageState === PAGE_STATE.SIGN_IN
                  ? handleLogInWithEmailAndPassword
                  : handleSignUpWithEmailAndPassword
              }
            >
              {pageState === PAGE_STATE.SIGN_IN
                ? t('login.signIn')
                : t('login.signUp')}
            </Button>
            {pageState === PAGE_STATE.SIGN_UP ? (
              <div
                className={cl(
                  styles.loginAgreement,
                  styles.loginAgreementMargin
                )}
              >
                {t('login.loginTip')}{' '}
                <a href={agreements?.privacy} className={styles.link}>
                  {t('login.privacyPolicy')}
                </a>{' '}
                {t('login.haveRead')}{' '}
                <a href={agreements?.term} className={styles.link}>
                  {t('login.termsOfUse')}
                </a>
              </div>
            ) : null}
          </>
        )}
        <Footer
          pageState={pageState}
          handldResetPassword={handldResetPassword}
          handleVerifyEmail={handleVerifyEmail}
          handleVerifyInviteCode={handleVerifyInviteCode}
          sendVerificationEmailLoading={sendVerificationEmailLoading}
          sendResetPasswordEmailLoading={sendResetPasswordEmailLoading}
          verifyInviteCodeLoading={verifyInviteCodeLoading}
          onLinkToLogin={onLinkToLogin}
          onLinkToSignup={onLinkToSignup}
          theme={theme}
          darkMainColor={darkMainColor}
        />
      </div>
    </div>
  )
}

export const FirebaseAuthForm = function (props: AuthProps) {
  const { locale = 'en' } = props

  const localeMessages = useMemo(() => {
    return locale === 'en' ? en : zh
  }, [locale])

  return (
    <IntlProvider messages={localeMessages} locale={locale}>
      <FirebaseAuthFormComponent {...props} />
    </IntlProvider>
  )
}
