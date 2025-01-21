import { jwtDecode } from "jwt-decode";

// ----------------------------------------------------------------------

const isValidToken = (accessToken: string | null): boolean => {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded: { exp: number } = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
};

const handleTokenExpired = (exp: number, refreshToken: string): void => {
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;
  const refreshDelay = 1000;

  console.log(
    "Token will refresh in:",
    (exp * 1000 - currentTime + refreshDelay) / 1000,
    "seconds"
  );

  const refreshAndScheduleNext = async (): Promise<void> => {
    if (timeLeft <= 0) {
      console.log("Token expired, stopping refresh.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return;
    }

    // try {
    //   const response = await RefreshToken(refreshToken);
    //   if (response.statusCode === 201) {
    //     const { accessToken, refreshToken: newRefreshToken } = response.metaData;
    //     localStorage.setItem("accessToken", accessToken);
    //     localStorage.setItem("refreshToken", newRefreshToken);
    //     console.log("Token refreshed successfully");

    //     const nextRefreshTime = exp * 1000 - currentTime + refreshDelay;
    //     setTimeout(refreshAndScheduleNext, nextRefreshTime);
    //   } else {
    //     console.log("Failed to refresh token:", response);
    //     localStorage.removeItem("accessToken");
    //     localStorage.removeItem("refreshToken");
    //   }
    // } catch (error) {
    //   console.error("Error during token refresh:", error);
    // }
  };

  setTimeout(refreshAndScheduleNext, timeLeft + refreshDelay);
};

const setSession = (accessToken: string | null | undefined, refreshToken: string | null | undefined): void => {
  if (accessToken && refreshToken) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    const { exp }: { exp: number } = jwtDecode(accessToken);
    handleTokenExpired(exp, refreshToken);
  } else {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

export { isValidToken, setSession };
