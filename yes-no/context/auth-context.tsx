import {createContext, useContext, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {ToastAndroid} from "react-native";
import {router} from "expo-router";

import {BASE_URL} from "@/constants";

export enum Role {
  ADMIN = "admin",
  USER = "user",
}

type AuthStateTypes = {
  accesstoken: string | null;
  _id: string | null;
  email: string | null;
  mobileNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  image: {
    url: string | null;
    public_id: string | null;
  };
  dob: string | null;
  gender: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  addressline: string | null;
  amount: number;
  role: "user" | "admin" | null;
  createdAt: string | null;
  updatedAt: string | null;
};

interface AuthProps {
  authState: AuthStateTypes;
  loading: boolean;
  onRegister: (
    email: string,
    mobileNumber: string,
    password: string,
    cf_password: string
  ) => void;
  onLogin: (email: string, password: string) => void;
  onLogout: () => void;
  addUserImage: (image: any, token: string) => void;
  addUserData: (
    firstName: string,
    lastName: string,
    username: string,
    dob: string,
    gender: string,
    token: string
  ) => void;
  addUserAddress: (
    city: string,
    state: string,
    country: string,
    zip: string,
    addressline: string,
    token: string
  ) => void;
  resetPassword: (
    previousPassword: string,
    newPassword: string,
    cf_newPassword: string,
    token: string
  ) => void;
}

const AuthContext = createContext<Partial<AuthProps>>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({children}: any) => {
  const [authState, setAuthState] = useState<AuthStateTypes>({
    accesstoken: null,
    _id: null,
    email: null,
    mobileNumber: null,
    firstName: null,
    lastName: null,
    username: null,
    image: {
      url: null,
      public_id: null,
    },
    dob: null,
    gender: null,
    city: null,
    state: null,
    country: null,
    zip: null,
    addressline: null,
    amount: 0,
    role: null,
    createdAt: null,
    updatedAt: null,
  });

  const [loading, setLoading] = useState(false);

  const getUserData = async () => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success === true) {
        setAuthState({...authState, ...response.data.user, accesstoken: token});
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const register = async (
    email: string,
    mobileNumber: string,
    password: string,
    cf_password: string
  ) => {
    try {
      setLoading(true);

      const response = await axios.post(`${BASE_URL}/register`, {
        email,
        mobileNumber,
        password,
        cf_password,
      });

      ToastAndroid.showWithGravityAndOffset(
        response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      if (response.data.success === true) {
        router.push("/login");
      }
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const response = await axios.post(`${BASE_URL}/login`, {email, password});

      ToastAndroid.showWithGravityAndOffset(
        response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      if (response.data.success === true) {
        await AsyncStorage.setItem("token", response.data.accesstoken);
        getUserData();
        router.push("/home");
      }
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setAuthState({
      accesstoken: null,
      _id: null,
      email: null,
      mobileNumber: null,
      firstName: null,
      lastName: null,
      username: null,
      image: {
        url: null,
        public_id: null,
      },
      dob: null,
      gender: null,
      city: null,
      state: null,
      country: null,
      zip: null,
      addressline: null,
      amount: 0,
      role: null,
      createdAt: null,
      updatedAt: null,
    });

    ToastAndroid.showWithGravityAndOffset(
      "User logout!",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };

  const addUserImage = async (image: any, token: string) => {
    try {
      setLoading(true);

      const response = await axios.put(
        `${BASE_URL}/user-image`,
        {image},
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      );

      ToastAndroid.showWithGravityAndOffset(
        response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      if (response.data.success === true) {
        getUserData();
      }
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setLoading(false);
    }
  };

  const addUserData = async (
    firstName: string,
    lastName: string,
    username: string,
    dob: string,
    gender: string,
    token: string
  ) => {
    try {
      setLoading(true);

      const response = await axios.put(
        `${BASE_URL}/user-data`,
        {firstName, lastName, username, dob, gender},
        {headers: {Authorization: `Bearer ${token}`}}
      );

      ToastAndroid.showWithGravityAndOffset(
        response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      if (response.data.success === true) {
        getUserData();
      }
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setLoading(false);
    }
  };

  const addUserAddress = async (
    city: string,
    state: string,
    country: string,
    zip: string,
    addressline: string,
    token: string
  ) => {
    try {
      setLoading(true);

      const response = await axios.put(
        `${BASE_URL}/user-address`,
        {city, state, country, zip, addressline},
        {headers: {Authorization: `Bearer ${token}`}}
      );

      ToastAndroid.showWithGravityAndOffset(
        response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

      if (response.data.success === true) {
        getUserData();
      }
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    previousPassword: string,
    newPassword: string,
    cf_newPassword: string,
    token: string
  ) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${BASE_URL}/reset-password`,
        {previousPassword, newPassword, cf_newPassword},
        {headers: {Authorization: `Bearer ${token}`}}
      );

      ToastAndroid.showWithGravityAndOffset(
        response.data.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } catch (error: any) {
      ToastAndroid.showWithGravityAndOffset(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    } finally {
      setLoading(false);
    }
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    addUserImage,
    addUserData,
    addUserAddress,
    resetPassword,
    authState,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
