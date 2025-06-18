import Link from "next/link";
import {
	RegisterPageContainer,
	RegisterHeader,
	RegisterWindow,
	OldcomerFooter,
} from "./styledElements";
import { RegisterForm } from "./subComponents/RegisterForm";

export default async function Login() {
	return (
		<RegisterPageContainer>
			<RegisterWindow>
				<RegisterHeader children="Sign Up" />
				<RegisterForm />
				<OldcomerFooter>
					Já possui uma conta? <Link href={"/login"}>Faça Login aqui</Link>.
				</OldcomerFooter>
			</RegisterWindow>
		</RegisterPageContainer>
	);
}
