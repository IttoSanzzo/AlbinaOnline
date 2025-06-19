import Link from "next/link";
import {
	RegisterPageContainer,
	RegisterHeader,
	RegisterWindow,
	OldcomerFooter,
} from "./styledElements";
import { RegisterForm } from "./subComponents/RegisterForm";

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
