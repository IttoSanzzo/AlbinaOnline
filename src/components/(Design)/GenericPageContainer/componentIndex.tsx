import { ReactNode } from "react";
import { BackgroundContainer, MainContainer } from "./styledElements";

interface GenericPageContainerProps {
	children: ReactNode;
}

export default function GenericPageContainer({
	children,
}: GenericPageContainerProps) {
	return (
		<MainContainer>
			<BackgroundContainer />
			{children}
		</MainContainer>
	);
}
