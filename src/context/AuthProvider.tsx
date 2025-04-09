import { createContext, useEffect, useReducer, ReactNode } from "react";
import { isValidToken, setSession } from "@/lib/jwtValid";
import toast from "react-hot-toast";
// import { jwtDecode } from "jwt-decode";
import { LoginRequest } from "@/models/Auth/LoginRequest";
import { getCurrentUserAPI, loginAPI } from "@/api/auth/LoginAPI";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import { RepresentativeRegisterRequest } from "@/models/Auth/RepresentativeRegister";
import { registerRepresentativeAPI, registerStudentAPI } from "@/api/auth/RegisterAPI";
// import { jwtDecode } from "jwt-decode";
import { ConfirmEmailAPI } from "@/api/auth/OtpAPI";
/* eslint-disable @typescript-eslint/no-explicit-any */

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: UserAuthDTO | null;
  isVerify: boolean;
}

// interface AuthState
interface AuthContextProps extends AuthState {
  method: string;
  login: (data: LoginRequest) => Promise<void>;
  registerUniversity: (data: RepresentativeRegisterRequest) => Promise<void>;
  registerStudent: (data: FormData) => Promise<void>;
  // login_type: (type: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  // register: (registerUser: User) => Promise<void>;
  sendOtp: (otp: string, email: string) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Initial State
const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  isVerify: false,
};

const handlers: Record<string, (state: AuthState, action: any) => AuthState> = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },

  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },

  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),

  REGISTER: (state) => {
    return {
      ...state,
      isAuthenticated: true,
      user: null,
    };
  },

  SEND_OTP: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: false,
      user,
      isVerify: true,
    };
  },
};

const reducer = (state: AuthState, action: any): AuthState =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext<AuthContextProps>({
  ...initialState,
  method: "jwt",
  login: async () => { },
  registerUniversity: async () => { },
  registerStudent: async () => { },
  sendOtp: async () => { },
  // login_type: async () => { },
  logout: async () => { },
  // register: async () => { },
  // sendOtp: () => { },
});

// ----------------------------------------------------------------------

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        console.log("Test kh access");
        if (accessToken && isValidToken(accessToken)) {
          // const { email } = jwtDecode<{ email: string }>(accessToken);
          const response = await getCurrentUserAPI();
          const userData = response.data;
          console.log(response);
          console.log("Test có access valid");
          if (
            response.data?.isVerified === false &&
            response.data.roles[0].toUpperCase() !== "ADMIN"
          ) {
            dispatch({
              type: "SEND_OTP",
              payload: { user: userData },
            });
          } else {
            dispatch({
              type: "INITIALIZE",
              payload: { isAuthenticated: true, user: userData },
            });
          }
        } else {
          setSession(accessToken, refreshToken);
          if (accessToken === null || refreshToken === null) {
            dispatch({
              type: "INITIALIZE",
              payload: {
                isAuthenticated: false,
                user: null,
              },
            });
          }
        }
      } catch (err) {
        setSession(null, null);
        console.error(err);
        dispatch({
          type: "INITIALIZE",
          payload: { isAuthenticated: false, user: null },
        });
      }
    };

    initialize();
  }, []);

  const login = async (dataInput: LoginRequest) => {
    try {
      const response = await loginAPI(dataInput);
      console.log(response);
      if (response) {
        const { data } = response;
        if (data?.user.roles[0].toUpperCase() == "ADMIN") {
          if (data?.accessToken)
            window.localStorage.setItem("accessToken", data?.accessToken);
          dispatch({
            type: "LOGIN",
            payload: {
              user: data?.user,
            },
          });
          return;
        }
        if (data?.user.isVerified == false) {
          dispatch({
            type: "SEND_OTP",
            payload: {
              user: data?.user,
            },
          });
          if (data?.accessToken && data?.refreshToken) {
            localStorage.setItem("accessToken", data?.accessToken);
            localStorage.setItem("refreshToken", data?.refreshToken);
          }
          const encodedEmail = btoa(dataInput.email);
          window.location.replace(`/verify-email/${encodedEmail}`);
          return;
        }
        setSession(data?.accessToken, data?.refreshToken);
        dispatch({
          type: "LOGIN",
          payload: {
            user: data?.user,
          },
        });
        toast.success("Login successfully");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const login_type = async (type: string, user: User) => {
  //   try {
  //     const response = await LoginExternal(type, user);
  //     const responseJson = await response.json();

  //     if (responseJson.metaData) {
  //       const { accessToken, refreshToken, user } = responseJson.metaData;
  //       setSession(accessToken, refreshToken);
  //       dispatch({
  //         type: "LOGIN",
  //         payload: { user },
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const registerUniversity = async (dataInput: RepresentativeRegisterRequest) => {
    try {
      const response = await registerRepresentativeAPI(dataInput);
      if (response) {
        dispatch({
          type: "REGISTER",
        });
        toast.success("Registration successful");
        setTimeout(() => {
          window.location.replace("/login");
        }, 600);
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const registerStudent = async (dataInput: FormData) => {
    try {
      const response = await registerStudentAPI(dataInput);
      console.log(response);
      if (response) {
        dispatch({
          type: "REGISTER",
        });
        toast.success("Registration successful");
        setTimeout(() => {
          window.location.replace("/login");
        }, 600);
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sendOtp = async (otp: string, email: string) => {
    try {
      await ConfirmEmailAPI({ email: email, otp: otp });
      toast.success("Verify Successfully");
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      const userResponse = await getCurrentUserAPI();
      if (userResponse.statusCode !== 200) {
        toast.error("Verify failed");
        return;
      }

      setSession(accessToken, refreshToken);
      dispatch({
        type: "LOGIN",
        payload: {
          user: userResponse.data,
        },
      });
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  const logout = async () => {
    setSession(null, null);
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        login,
        registerUniversity,
        registerStudent,
        sendOtp,
        logout,
        // login_type,
        // register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
