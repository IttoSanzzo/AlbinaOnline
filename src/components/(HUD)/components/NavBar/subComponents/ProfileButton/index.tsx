import Image from "next/image";
import { ProfileButtonContainer } from "./styledElements";

export default function ProfileButton() {
	return (
		<ProfileButtonContainer>
			<Image
				src={
					"https://lh3.googleusercontent.com/a/ACg8ocLEBZEHQsYI_CIwg4dzVP-GXo2a5jWi8e4UftbR6wEbah5NQJ-6PA=s96-c-rg-br100"
				}
				alt="Profile image"
				width={32}
				height={32}
				priority
			/>
		</ProfileButtonContainer>
	);
}
