import { Button } from 'antd'
import cl from 'classnames'
import { PAGE_STATE } from '..'
import { useFirebase } from '../../FirebaseProvider'
import styles from '../index.module.css'
import { FooterProps } from '../types'
import { useTranslations } from 'use-intl'

export const Footer = ({
  pageState,
  handldResetPassword,
  handleVerifyEmail,
  handleVerifyInviteCode,
  sendVerificationEmailLoading,
  sendResetPasswordEmailLoading,
  verifyInviteCodeLoading,
  onLinkToLogin,
  onLinkToSignup,
  theme,
  darkMainColor
}: FooterProps) => {
  const t = useTranslations()
  const getFooterContent = (pageState: string) => {
    switch (pageState) {
      case PAGE_STATE.SIGN_IN:
        return (
          <>
            <span>{t('login.tip', { projectName: 'XAnswer' })}</span>
            <div onClick={onLinkToSignup} className={styles.link}>
              {t('login.createAccount')}
            </div>
          </>
        )
      case PAGE_STATE.SIGN_UP:
        return (
          <>
            <span>{t('login.haveAccount')}</span>
            <div onClick={onLinkToLogin} className={styles.link}>
              {t('login.logIn')}
            </div>
          </>
        )
      case PAGE_STATE.RESET_PASSWORD:
        return (
          <>
            <Button
              type="primary"
              onClick={handldResetPassword}
              loading={sendResetPasswordEmailLoading}
              className={cl(
                styles.buttonCls,
                styles.authButton,
                styles.resetPasswordButton
              )}
              style={{
                backgroundColor: theme === 'dark' ? darkMainColor : '#222',
                color: '#fff'
              }}
            >
              {t('login.sendResetPasswordEmail')}
            </Button>
            <div onClick={onLinkToLogin} className={styles.link}>
              {t('login.linkToLogin')}
            </div>
          </>
        )
      case PAGE_STATE.SEND_VERIFICATION_EMAIL:
        return (
          <>
            <Button
              type="primary"
              className={styles.buttonCls}
              onClick={handleVerifyEmail}
              loading={sendVerificationEmailLoading}
              style={{
                backgroundColor: theme === 'dark' ? darkMainColor : '#222',
                color: '#fff'
              }}
            >
              {t('login.sendVerificationEmail')}
            </Button>
            <div onClick={onLinkToLogin} className={styles.link}>
              {t('login.linkToLogin')}
            </div>
          </>
        )
      case PAGE_STATE.INVITE:
        return (
          <>
            <Button
              type="primary"
              onClick={handleVerifyInviteCode}
              loading={verifyInviteCodeLoading}
              className={styles.buttonCls}
              style={{
                backgroundColor: theme === 'dark' ? darkMainColor : '#222',
                color: '#fff'
              }}
            >
              Verify invite code
            </Button>
            <div onClick={onLinkToLogin} className={styles.link}>
              {t('login.linkToLogin')}
            </div>
          </>
        )
      default:
        return <></>
    }
  }

  return (
    <div
      className={cl(theme === 'dark' ? styles.darkFooter : '', {
        [styles.footer]: ![
          PAGE_STATE.RESET_PASSWORD,
          PAGE_STATE.SEND_VERIFICATION_EMAIL,
          PAGE_STATE.INVITE
        ].includes(pageState),
        [styles.resetPasswordFooter]: [
          PAGE_STATE.RESET_PASSWORD,
          PAGE_STATE.SEND_VERIFICATION_EMAIL,
          PAGE_STATE.INVITE
        ].includes(pageState)
      })}
    >
      {getFooterContent(pageState)}
    </div>
  )
}
