import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { SocialLoginButton } from "./subComponents/SocialLoginButton";

const SocialLoginsContainer = newStyledElement.div(
	styles.socialLoginsContainer,
);
const SocialLoginButtonsContainer = newStyledElement.div(
	styles.socialLoginButtonsContainer,
);
const SocialLoginMessage = newStyledElement.p(styles.socialLoginMessage);

interface SocialLoginsProps {
	redirectTo?: string;
}
export async function SocialLogins({ redirectTo }: SocialLoginsProps) {
	return (
		<SocialLoginsContainer>
			<SocialLoginMessage>Ou entre utilizando...</SocialLoginMessage>
			<SocialLoginButtonsContainer>
				<SocialLoginButton
					provider="discord"
					label="Discord"
					icon={
						"https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://discord.com&size=50"
					}
					redirectTo={redirectTo}
				/>
			</SocialLoginButtonsContainer>
		</SocialLoginsContainer>
	);
}
