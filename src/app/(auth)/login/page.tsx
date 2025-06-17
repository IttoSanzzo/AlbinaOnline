import Link from "next/link";
import {
	LoginHeader,
	LoginPageContainer,
	LoginWindow,
	NewcomerFooter,
} from "./styledElements";
import { LoginForm } from "./subComponents/LoginForm";

export default async function Login() {
	return (
		<LoginPageContainer>
			<LoginWindow>
				<LoginHeader children="Log In" />
				<LoginForm />
				<NewcomerFooter>
					Novo aqui? <Link href={"/register"}>Cadastre-se agora</Link>.
				</NewcomerFooter>
			</LoginWindow>
		</LoginPageContainer>
	);
}
