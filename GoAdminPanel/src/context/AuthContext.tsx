// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios

// ** Config
import authConfig from 'src/configs/auth'

import Cookies from 'js-cookie'



// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(
        'access_token'
      )!;
      if (storedToken) {
        setLoading(true)

        setUser(JSON.parse(localStorage.getItem("userData")!));
        setLoading(false);
      } else {
        setUser(null)

        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const handleLogin = async (params: LoginParams, errorCallback?: ErrCallbackType) => {
    console.log('params:', params)


    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Login request failed');
      }

      const data = await response.json();

      const returnUrl = router.query.returnUrl;

      // Kullanıcı bilgilerini ayarla ve localStorage'a kaydet
      setUser(data.data);
      Cookies.set('jwt', data.token)

      localStorage.setItem(
        authConfig.storageTokenKeyName,
        data.token
      );
      window.localStorage.setItem('userData', JSON.stringify(data.data));

      localStorage.setItem(
        "userData",
        JSON.stringify({
          ...data.data,
          role: "admin",
        })
      );
      setUser({ ...data.data, role: "admin" });


      // Yönlendirme URL'si belirle
      const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/';

      // Yönlendirme yap
      router.replace(redirectURL);
    } catch (err) {
     errorCallback(err);
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
