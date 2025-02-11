import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import LoadingAnimation from "@/components/ui/loading";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getCurrentUserAPI } from "@/api/auth/LoginAPI";
import { UserAuthDTO } from "@/models/Auth/UserAuth";
import { ProfileForm } from "@/components/global/setting/ProfileForm";
import WalletStaff from "@/components/partial/staff/staff-personal/walletStaff";

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
  return (
    <>
      <div className="flex items-center justify-between pt-4">
        <Heading
          title={`Settings`}
          description="Manage your account settings and set e-mail preferences."
        />
      </div>
      <Separator />
      <Tabs
        defaultValue="profile"
        // value={activeTab}
        // onValueChange={setActiveTab}
        className="w-full mt-3 p-2"
      >
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileForm initialData={userInfo || null} />
        </TabsContent>
        <TabsContent value="account">
          <WalletStaff />
        </TabsContent>
      </Tabs>
    </>
  );
};
export default ProfilePage;
