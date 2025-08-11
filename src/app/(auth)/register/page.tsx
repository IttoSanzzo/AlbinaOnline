import Link from "next/link";
import { RegisterForm } from "./subComponents/RegisterForm";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const RegisterPageContainer = newStyledElement.div(
	styles.registerPageContainer
);
const RegisterWindow = newStyledElement.div(styles.registerWindow);
const RegisterHeader = newStyledElement.h1(styles.registerHeader);
const OldcomerFooter = newStyledElement.div(styles.oldcomerFooter);

interface RegisterPageProps {
	searchParams: Promise<{ redirectTo?: string }>;
}
export default async function RegisterPage({
	searchParams,
}: RegisterPageProps) {
	const params = await searchParams;
	const redirectTo = params.redirectTo;
	const loginPageLink = `/login${
		redirectTo ? `?redirectTo=${redirectTo}` : ""
	}`;

	return (
		<RegisterPageContainer>
			<RegisterWindow>
				<RegisterHeader children="Sign Up" />
				<RegisterForm redirectTo={redirectTo} />
				<OldcomerFooter>
					Já possui uma conta? <Link href={loginPageLink}>Faça Login aqui</Link>
					.
				</OldcomerFooter>
			</RegisterWindow>
		</RegisterPageContainer>
	);
}
