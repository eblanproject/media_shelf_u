import type { UserProfile } from "@/types/user";
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";

type ProfileInfoProps = {
  user: UserProfile;
};

export default function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <section>
        <div className="flex items-end w-full lg:max-w-[80vw] min-h-[32dvh] bg-cover bg-center mx-auto "
             style={{
                 backgroundImage:
                     "url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=80)",
             }}>

            <div className="flex flex-row w-full h-30 opacity-80 bg-black/60 ">

                {/*Profile image and logout*/}

                <div className="flex flex-3 flex-row w-10 h-auto text-center items-center">
                    <div className="flex w-15 h-15 ml-10 shrink-0 items-center justify-center rounded-full bg-yellow-200 text-2xl font-black text-black">
                        {user.username.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex flex-col ml-3 text-left">
                        <span className="font-bold">{user.username}</span>
                        <span className="text-sm text-gray-300">{user.email}</span>
                    </div>


                </div>

                {/*Logout and settings*/}

                <section className="flex flex-row w-full h-full items-center justify-end pr-4 gap-4">

                    <Link href="/settings">
                    <button className="bg-black/30 hover:bg-black text-white font-bold py-2 px-4 rounded border border-gray-700">

                        Settings
                    </button>
                    </Link>

                    <LogoutButton className="cursor-pointer bg-black/30 hover:bg-black text-white font-bold py-2 px-4 rounded border border-gray-700" />
                </section>

            </div>

        </div>
    </section>
  );
}
