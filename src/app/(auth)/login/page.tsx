import Link from "next/link";
import { LoginForm } from "./subComponents/LoginForm";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";

const LoginPageContainer = newStyledElement.div(styles.loginPageContainer);
const LoginWindow = newStyledElement.div(styles.loginWindow);
const LoginHeader = newStyledElement.h1(styles.loginHeader);
const NewcomerFooter = newStyledElement.div(styles.newcomerFooter);

interface LoginPageProps {
	searchParams: Promise<{ redirectTo?: string }>;
}
export default async function LoginPage({ searchParams }: LoginPageProps) {
	const params = await searchParams;
	const redirectTo = params.redirectTo;
	const registerPageLink = `/register${
		redirectTo ? `?redirectTo=${redirectTo}` : ""
	}`;

	return (
		<LoginPageContainer>
			<LoginWindow>
				<LoginHeader children="Log In" />
				<LoginForm redirectTo={redirectTo} />
				<NewcomerFooter>
					Novo aqui? <Link href={registerPageLink}>Cadastre-se agora</Link>.
				</NewcomerFooter>
			</LoginWindow>
		</LoginPageContainer>
	);
}
