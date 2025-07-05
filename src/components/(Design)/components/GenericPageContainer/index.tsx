import { ReactNode } from "react";
import { ContentsContainer, MainContainer } from "./styledElements";
import { PageBanner } from "./subComponents/PageBanner";
import { PageHeader } from "./subComponents/PageHeader";
import { StaticImageData } from "next/image";
import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";

interface GenericPageContainerProps {
	children: ReactNode;
	banner?: string | StaticImageData;
	icon?: string;
	borderColor?: string;
	title: string;
}

export function GenericPageContainer({
	children,
	title,
	banner,
	icon,
	borderColor,
}: GenericPageContainerProps) {
	return (
		<MainContainer>
			<PageBanner src={banner ? banner : AlbinaLogo} />
			<ContentsContainer>
				<PageHeader
					title={title}
					icon={icon ? icon : "/Mock/AlbinaLogo.png"}
					borderColor={borderColor}
				/>
				{children}
			</ContentsContainer>
		</MainContainer>
	);
}
