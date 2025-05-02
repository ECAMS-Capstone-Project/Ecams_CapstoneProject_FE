import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getCurrentUserAPI } from "@/api/auth/LoginAPI";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import { ProfileForm } from "@/components/global/setting/ProfileForm";
import UserFavoritesPage from "../student/home/UserFavoritesPage";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserAuthDTO>();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const userInfo = await getCurrentUserAPI();
        if (userInfo) {
          setUserInfo(userInfo.data);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  const isRepresentative = userInfo?.roles.includes("REPRESENTATIVE");

  return (
    <>
      <div className="flex items-center justify-between pt-4">
        <Heading
          title={`Settings`}
          description={
            isRepresentative
              ? "Manage your representative account settings and profile information."
              : "Manage your account settings and profile information."
          }
        />
      </div>
      <Separator />
      <Tabs defaultValue="profile" className="w-full mt-3 p-2">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {!isRepresentative && (
            <TabsTrigger value="account">Preference</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>
        {!isRepresentative && (
          <TabsContent value="account">
            <UserFavoritesPage />
          </TabsContent>
        )}
      </Tabs>
    </>
  );
};

export default ProfilePage;
