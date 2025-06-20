import Image from "next/image";
import { ProfileButtonContainer } from "./styledElements";
import { fullUser } from "@/libs/stp@types";

interface ProfileButtonProps {
	user: fullUser | null;
}
export function ProfileButton({ user }: ProfileButtonProps) {
	if (!user) return <ProfileButtonContainer />;
	return (
		<ProfileButtonContainer>
			<Image
				src={user.iconUrl}
				alt="Profile image"
				width={32}
				height={32}
				priority
			/>
		</ProfileButtonContainer>
	);
}
