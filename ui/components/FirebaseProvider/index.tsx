import { initializeApp } from 'firebase/app';
import {
  Auth,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  getIdToken,
  GithubAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  OAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import {
  createContext,
  FC,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { debug } from '@aidc/utils';

const FirebaseContext = createContext<FirebaseContextValue>({
  projectName: '',
  auth: {} as Auth,
  handleSignInWithOtherProvider: () => Promise.resolve(),
  handleSignInWithGoogle: () => Promise.resolve(null),
  handleSignInWithGithub: () => Promise.resolve(null),
  handleSignInWithFacebook: () => Promise.resolve(null),
  signUpWithEmailAndPassword: () => Promise.resolve({} as UserCredential),
  logInWithEmailAndPassword: () => Promise.resolve(),
  sendResetPasswordEmail: () => Promise.resolve(),
  sendVerificationEmail: () => Promise.resolve(),
  handleSignOut: () => {},
  updateUserProfile: () => Promise.resolve(),
  updateCurrentUserPassword: () => Promise.resolve(),
});

export const useFirebase = () => useContext(FirebaseContext);

interface FirebaseContextValue {
  projectName: string;
  auth: Auth;
  handleSignInWithOtherProvider: (
    platform: 'google' | 'github' | 'facebook',
  ) => Promise<void>;
  handleSignInWithGoogle: () => Promise<null | undefined>;
  handleSignInWithGithub: () => Promise<null | undefined>;
  handleSignInWithFacebook: () => Promise<null | undefined>;
  signUpWithEmailAndPassword: (
    email: string,
    password: string,
  ) => Promise<UserCredential>;
  logInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  sendResetPasswordEmail: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  handleSignOut: () => void;
  updateUserProfile: (userInfo: Partial<User>) => Promise<void>;
  updateCurrentUserPassword: (newPassword: string) => Promise<void>;
}

interface FirebaseConfigProps {
  apiKey: string;
  authDomain: string;
  projectId: string;
  projectName: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

interface FirebaseProviderProps {
  config: FirebaseConfigProps;
  children: React.ReactNode;
  tokenVerification?: (idToken: string) => Promise<any>;
  onAuthStateChanged?: (params: any) => void;
}

export const FirebaseProvider: FC<FirebaseProviderProps> = ({
  config,
  tokenVerification,
  onAuthStateChanged,
  children,
}) => {
  const [auth, setAuth] = useState<Auth>({} as Auth);
  const [projectName, setProjectName] = useState<string>(config.projectName);

  // 使用useRef来创建引用，并初始化为null
  const googleProviderRef = useRef<GoogleAuthProvider>(
    new GoogleAuthProvider(),
  );
  const githubProviderRef = useRef<GithubAuthProvider>(
    new GithubAuthProvider(),
  );
  const facebookProviderRef = useRef<FacebookAuthProvider>(
    new FacebookAuthProvider(),
  );

  useEffect(() => {
    // 初始化 Firebase 应用程序
    initializeApp(config);
    const _auth = getAuth();
    setAuth(_auth);
    setProjectName(config.projectName);
    if (onAuthStateChanged) {
      // 添加一个身份验证状态变化的监听器
      auth.onAuthStateChanged(onAuthStateChanged);
    }
    googleProviderRef.current = new GoogleAuthProvider();
    githubProviderRef.current = new GithubAuthProvider();
    facebookProviderRef.current = new FacebookAuthProvider();
  }, [config]);

  const signInProviders = {
    google: {
      provider: googleProviderRef.current,
      prototype: GoogleAuthProvider,
    },
    github: {
      provider: githubProviderRef.current,
      prototype: GithubAuthProvider,
    },
    facebook: {
      provider: facebookProviderRef.current,
      prototype: FacebookAuthProvider,
    },
  };

  // 定义凭证类型
  const CredentialType = {
    ID_TOKEN: projectName + 'IdToken',
    PENDING: projectName + 'PendingCred',
  };

  /**
   * @description 定义一个通用的函数来检索凭证
   * @param type 凭证类型
   */
  const retrieveCredential = (type: string) => {
    try {
      // 尝试从 localStorage 获取凭证字符串
      const credString = localStorage.getItem(type);
      if (credString) {
        // 如果凭证字符串存在，尝试解析它为JSON
        const cred = JSON.parse(credString);
        return cred;
      }
    } catch (error) {
      // 如果解析JSON失败，或者其他错误发生，记录错误
      console.error(
        `[${projectName} Firebase] Error retrieving ${type} credential:`,
        error,
      );
      throw error;
    }
    // 如果没有凭证或者解析失败，返回 null
    return null;
  };

  /**
   * @description 定义一个通用的三方登录处理函数
   * @param platform 用于登录的三方平台
   * @param onError 登录错误处理函数
   */
  const handleSignInWithPlatform = async (
    platform: 'google' | 'github' | 'facebook',
  ) => {
    const provider = signInProviders[platform].provider;
    try {
      const result = await signInWithPopup(auth, provider);
      const credential =
        signInProviders[platform].prototype.credentialFromResult(result);
      debug(`[${projectName} Firebase] Firebase credential:`, credential);
      // 保存凭证

      if (tokenVerification) {
        const idToken = await getIdToken(result.user);
        const tokenVerificationResult = await tokenVerification(idToken);
        debug(
          `[${projectName} Firebase] Token verification result:`,
          tokenVerificationResult,
        );
        // 登录成功后重定向到主页或其他页面 交给组件自己完成
        return tokenVerificationResult;
      }
    } catch (error) {
      // 默认错误处理
      debug(`[${projectName} Firebase] Error during sign-in`, error);
      const errorCode = (error as any).code;
      const errorMessage = (error as any).message;
      // 用户账号使用的邮箱
      const email = (error as any).customData?.email;
      // 这里可以根据错误做进一步处理，比如显示错误消息给用户
      debug(`[${projectName} Firebase] Error during sign-in with: ${platform}`);
      debug(`[${projectName} Firebase] Error code: ${errorCode}`);
      debug(`[${projectName} Firebase] Error message: ${errorMessage}`);
      debug(`[${projectName} Firebase] User email: ${email}`);
      throw error;
    }
  };

  /**
   * @description 当用户选择了其他登录方式后执行
   * @param platform 用于登录的三方平台
   */
  const handleSignInWithOtherProvider = async (
    platform: 'google' | 'github' | 'facebook',
  ) => {
    const userSelectedProvider = signInProviders[platform].provider;
    try {
      // 用户使用选择的其他方式登录（例如 Facebook）
      let result = await signInWithPopup(
        auth,
        new OAuthProvider(userSelectedProvider.providerId),
      );
      // 尝试检索之前存储的待处理凭证
      let pendingCred = retrieveCredential(CredentialType.PENDING);
      if (pendingCred) {
        // 链接 Google 凭证到现有账户
        let user = await linkWithCredential(result.user, pendingCred);
        debug(
          `[${projectName} Firebase] Log in with selected method, user: `,
          user,
        );
        // ...处理账户链接成功后的逻辑...
        // 清除待处理凭证
        localStorage.removeItem('pendingCred');

        // 登录成功后重定向到主页或其他页面 交给组件自己完成
      }
      // ...处理用户登录成功后的逻辑...
    } catch (error) {
      // 默认错误处理
      console.error(`[${projectName} Firebase] Error during sign-in`, error);
      const errorCode = (error as any).code;
      const errorMessage = (error as any).message;
      // 用户账号使用的邮箱
      const email = (error as any).customData?.email;
      // 这里可以根据错误做进一步处理，比如显示错误消息给用户
      debug(`[${projectName} Firebase] Error during sign-in with: ${platform}`);
      debug(`[${projectName} Firebase] Error code: ${errorCode}`);
      debug(`[${projectName} Firebase] Error message: ${errorMessage}`);
      debug(`[${projectName} Firebase] User email: ${email}`);
      throw error;
    }
  };

  /**
   * @description 封装一个google登录的函数
   */
  const handleSignInWithGoogle = async () => {
    return await handleSignInWithPlatform('google');
  };

  /**
   * @description 封装一个github登录的函数
   */
  const handleSignInWithGithub = async () => {
    return await handleSignInWithPlatform('github');
  };

  /**
   * @description 封装一个facebook登录的函数
   */
  const handleSignInWithFacebook = async () => {
    return await handleSignInWithPlatform('facebook');
  };

  /**
   * @description 用户使用账号密码注册
   * @param email 用户注册邮箱
   * @param password 用户注册密码
   */
  const signUpWithEmailAndPassword = async (email: any, password: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // 注册成功
      const user = userCredential.user;
      debug(`[${projectName} Firebase] User created:`, user);
      // 这里可以添加后续的用户注册成功的处理逻辑
      // 例如更新数据库, 发送欢迎邮件, 或者跳转到其他页面等
      // 发送邮箱验证邮件
      await sendEmailVerification(user);
      debug(`[${projectName} Firebase] Verification email sent.`);
      return userCredential;
    } catch (error) {
      // 注册失败，处理错误
      const errorCode = (error as any).code;
      const errorMessage = (error as any).message;
      console.error(
        `[${projectName} Firebase] Error in user registration:`,
        errorCode,
        errorMessage,
      );
      throw error; // 可以选择重新抛出错误或返回错误信息
    }
  };

  /**
   * @description 用户使用账号密码登录
   * @param email 用户登录邮箱
   * @param password 用户登录密码
   */
  const logInWithEmailAndPassword = async (email: any, password: any) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // 登录成功
      const user = userCredential.user;
      debug(`[${projectName} Firebase] User signed in:`, user);

      if (!user.emailVerified) {
        // 邮箱未验证
        // 这里可以引导用户到验证提示页面或重新发送验证邮件
        // 由于firebase邮箱验证需要用户是登录状态，因此这里不能将用户signout
        throw new Error('Email not verified. Please verify your email.');
      } else {
        // 这里可以添加后续的用户登录成功的处理逻辑
        if (tokenVerification) {
          const idToken = await getIdToken(user);
          const tokenVerificationResult = await tokenVerification(idToken);
          debug(
            `[${projectName} Firebase] Token verification result:`,
            tokenVerificationResult,
          );
          return tokenVerificationResult;
        }
      }
    } catch (error) {
      // 登录失败，处理错误
      const errorCode = (error as any).code;
      const errorMessage = (error as any).message;
      console.error(
        `[${projectName} Firebase] Error in user login:`,
        errorCode,
        errorMessage,
      );
      throw error; // 可以选择重新抛出错误或返回错误信息
    }
  };

  /**
   * @description 用户通过邮箱重置密码
   * @param email 用户重置密码的邮箱
   */
  const sendResetPasswordEmail = async (email: any) => {
    try {
      await sendPasswordResetEmail(auth, email);
      // 密码重置邮件已发送
      debug(
        `[${projectName} Firebase] Password reset email sent successfully.`,
      );
      // 这里可以在组件中添加成功发送邮件之后的逻辑，比如更新UI或通知用户
    } catch (error) {
      // 发送邮件失败，处理错误
      console.error(
        `[${projectName} Firebase] Error sending password reset email:`,
        (error as any).code,
        (error as any).message,
      );
      // 这里可以添加错误处理逻辑，比如展示错误消息给用户
      throw error; // 重新抛出异常以便调用者可以进一步处理
    }
  };

  /**
   * @description 用户注册邮箱验证
   */
  const sendVerificationEmail = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        // 邮箱验证邮件已发送
        debug(
          `[${projectName} Firebase] Verification email sent successfully.`,
        );
        // 这里可以在组件中添加成功发送邮件之后的逻辑，比如更新UI或通知用户
      }
    } catch (error) {
      // 发送邮件失败，处理错误
      console.error(
        `[${projectName} Firebase] Error sending password reset email:`,
        (error as any).code,
        (error as any).message,
      );
      // 这里可以添加错误处理逻辑，比如展示错误消息给用户
      throw error; // 重新抛出异常以便调用者可以进一步处理
    }
  };

  /**
   * @description 用户登出
   */
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // 清空localStorage
        for (const type in CredentialType) {
          if (CredentialType.hasOwnProperty(type)) {
            localStorage.removeItem(
              CredentialType[type as keyof typeof CredentialType],
            );
          }
        }
        // Sign-out successful.
        debug(`[${projectName} Firebase] Sign out successful`);
      })
      .catch((error: any) => {
        // An error happened.
        debug(`[${projectName} Firebase] Sign out error`, error);
        throw error;
      });
  };

  /**
   * @description 更新用户信息
   * @param userInfo 用户信息
   */
  const updateUserProfile = async (userInfo: Partial<User>) => {
    if (!auth.currentUser) return;
    try {
      await updateProfile(auth.currentUser, userInfo);
      // Profile updated!
      debug(`[${projectName} Firebase] User profile updated:`, userInfo);
    } catch (error) {
      // An error occurred
      debug(`[${projectName} Firebase] Error updating user profile:`, error);
      throw error;
    }
  };

  /**
   * @description 更新当前用户的密码
   * @param newPassword 新密码
   */
  const updateCurrentUserPassword = async (newPassword: string) => {
    const { currentUser } = auth;
    if (currentUser) {
      try {
        // 等待密码更新操作完成
        await updatePassword(currentUser, newPassword);
        // 更新成功
        debug(`[${projectName} Firebase] Password update successful.`);
      } catch (error) {
        // 错误处理
        console.error('An error occurred while updating password:', error);
        throw error; // 向上抛出异常，以便调用者可以处理它
      }
    } else {
      debug(`[${projectName} Firebase] No user is currently signed in.`);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        auth,
        projectName,
        handleSignInWithOtherProvider,
        handleSignInWithGoogle,
        handleSignInWithGithub,
        handleSignInWithFacebook,
        signUpWithEmailAndPassword,
        logInWithEmailAndPassword,
        sendResetPasswordEmail,
        sendVerificationEmail,
        handleSignOut,
        updateUserProfile,
        updateCurrentUserPassword,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
