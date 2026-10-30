"use client";

import ProfileInfo from "@/components/profile/ProfileInfo";
import FavoritesPage from "@/app/(site)/favorites/page";
import { MOCKUSER } from "@/lib/mock/user";

export default function ProfilePage() {
  return (
      <>
          <ProfileInfo user={MOCKUSER} />
          <FavoritesPage/>
</>



  );
}
