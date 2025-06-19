import Link from "next/link";
import {
	LoginHeader,
	LoginPageContainer,
	LoginWindow,
	NewcomerFooter,
} from "./styledElements";
import { LoginForm } from "./subComponents/LoginForm";

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
