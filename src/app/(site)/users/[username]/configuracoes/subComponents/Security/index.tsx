import { UIBasics } from "@/components/(UIBasics)";
import { ChangePassword } from "./subComponents/ChangePassword";

// interface SecurityProps {
// username: string;
// }
export function Security() {
// { username }: SecurityProps
	return (
		<UIBasics.Box backgroundColor="gray">
			<UIBasics.Header
				children={"Segurança"}
				textColor="gray"
				textAlign="center"
			/>
			<ChangePassword />
		</UIBasics.Box>
	);
}
