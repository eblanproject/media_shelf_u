import type { UserProfile } from "@/types/user";
import Link from "next/link";

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
                    <div className="flex w-15 h-15 bg-green-50 ml-10 rounded-full shrink-0">

                    </div>

                    <div className="flex flex-col ml-3 text-left">
                        <span>{user.name}</span>
                        <span>{user?.email}</span>
                    </div>


                </div>

                {/*Logout and settings*/}

                <section className="flex flex-row w-full h-full items-center justify-end pr-4 gap-4">

                    <Link href="/settings">
                    <button className="bg-black/30 hover:bg-black text-white font-bold py-2 px-4 rounded border border-gray-700">

                        Settings
                    </button>
                    </Link>

                    <button className="bg-black/30 hover:bg-black text-white font-bold py-2 px-4 rounded border border-gray-700">
                        Logout
                    </button>
                </section>

            </div>

        </div>
    </section>
  );
}
