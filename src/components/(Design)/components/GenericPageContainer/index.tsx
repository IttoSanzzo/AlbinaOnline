import { ReactNode } from "react";
import { ContentsContainer, MainContainer } from "./styledElements";
import { PageBanner } from "./subComponents/PageBanner";
import { PageHeader } from "./subComponents/PageHeader";
import { StaticImageData } from "next/image";
import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import { AnchorNavBar, AnchorProps } from "@/components/(HUD)";

interface GenericPageContainerProps {
	children: ReactNode;
	banner?: string | StaticImageData;
	favicon?: string;
	title: string;
	anchors?: AnchorProps[];
}

export function GenericPageContainer({
	children,
	title,
	banner,
	favicon,
	anchors = [],
}: GenericPageContainerProps) {
	return (
		<MainContainer>
			<PageBanner src={banner ? banner : AlbinaLogo} />
			<ContentsContainer>
				<PageHeader
					title={title}
					icon={favicon ? favicon : "/Mock/AlbinaLogo.png"}
				/>
				{children}
			</ContentsContainer>
			{anchors.length !== 0 && <AnchorNavBar anchors={anchors} />}
		</MainContainer>
	);
}
