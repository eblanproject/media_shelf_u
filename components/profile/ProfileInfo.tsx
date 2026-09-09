import type { UserProfile } from "@/types/user";

type ProfileInfoProps = {
  user: UserProfile;
};

export default function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <section>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </section>
  );
}
