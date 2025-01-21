import { createContext, useEffect, useReducer, ReactNode } from "react";
import { setSession } from "@/lib/jwtValid";
import toast from "react-hot-toast";
// import { jwtDecode } from "jwt-decode";
import { LoginRequest } from "@/models/Auth/LoginRequest";
import { loginAPI } from "@/api/auth/LoginAPI";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import { StaffRegisterRequest } from "@/models/Auth/StaffRegister";
import { registerStaffAPI } from "@/api/auth/RegisterAPI";
/* eslint-disable @typescript-eslint/no-explicit-any */

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: UserAuthDTO | null;
  isVerify: boolean;
}

interface AuthContextProps extends AuthState {
  method: string;
  login: (data: LoginRequest) => Promise<void>;
  registerUniversity: (data: StaffRegisterRequest) => Promise<void>;
  // login_type: (type: string, user: User) => Promise<void>;
  // logout: () => Promise<void>;
  // register: (registerUser: User) => Promise<void>;
  // sendOtp: (otp: string, email: string) => void;
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
  registerUniversity: async () => { }
  // login_type: async () => { },
  // logout: async () => { },
  // register: async () => { },
  // sendOtp: () => { },
});

// ----------------------------------------------------------------------

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        // const accessToken = localStorage.getItem("accessToken");
        // const refreshToken = localStorage.getItem("refreshToken");
        // if (accessToken && isValidToken(accessToken)) {
        //   const { email } = jwtDecode<{ email: string }>(accessToken);
        //   const response = await loginAPI(email);
        //   const responseJson = await response.json();
        //   const user = responseJson.metaData;

        //   if (user && user.emailConfirmed === false && user.roleName !== "Administrator") {
        //     dispatch({
        //       type: "SEND_OTP",
        //       payload: { user },
        //     });
        //   } else {
        //     dispatch({
        //       type: "INITIALIZE",
        //       payload: { isAuthenticated: true, user },
        //     });
        //   }
        // } else {
        //   setSession(accessToken, refreshToken);
        //   if (accessToken === null || refreshToken === null) {
        //     dispatch({
        //       type: "INITIALIZE",
        //       payload: {
        //         isAuthenticated: false,
        //         user: null,
        //       },
        //     });
        //   }
        // }
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

  const login = async (data: LoginRequest) => {
    try {
      const response = await loginAPI(data);
      console.log(response);
      if (response) {
        const { data } = response;
        setSession(data?.accessToken, data?.refreshToken);
        dispatch({
          type: "LOGIN",
          payload: data?.user,
        });
        toast.success("login thành công")
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something error")
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

  const registerUniversity = async (dataInput: StaffRegisterRequest) => {
    try {
      const response = await registerStaffAPI(dataInput);
      if (response) {
        dispatch({
          type: "REGISTER",
        });
        toast.success("Registration successful");
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const sendOtp = (otp: string, email: string) => {
  //   VerifyUser(otp, email)
  //     .then(() => {
  //       toast.success("OTP verified successfully");
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       toast.error("Failed to verify OTP");
  //     });
  // };

  // const logout = async () => {
  //   setSession(null, null);
  //   dispatch({ type: "LOGOUT" });
  // };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        login,
        registerUniversity,
        // login_type,
        // logout,
        // register,
        // sendOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
