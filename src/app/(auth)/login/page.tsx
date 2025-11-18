import Link from "next/link";
import { LoginForm } from "./subComponents/LoginForm";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { Metadata } from "next";
import { resolveMetadata } from "@/metadata/resolveMetadata";
import { assembleMetadata } from "@/metadata/assembleMetadata";

const LoginPageContainer = newStyledElement.div(styles.loginPageContainer);
const LoginWindow = newStyledElement.div(styles.loginWindow);
const LoginHeader = newStyledElement.h1(styles.loginHeader);
const NewcomerFooter = newStyledElement.div(styles.newcomerFooter);

interface LoginPageProps {
	searchParams: Promise<{ redirectTo?: string }>;
}

export async function generateMetadata({
	searchParams,
}: LoginPageProps): Promise<Metadata> {
	const { redirectTo } = await searchParams;
	if (redirectTo) {
		const metadata = await resolveMetadata(redirectTo);
		if (metadata != undefined) return metadata;
		return assembleMetadata({
			title: "Not Found",
		});
	}
	return assembleMetadata({
		title: "Login",
		description: "Login",
		route: "/login",
	});
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
