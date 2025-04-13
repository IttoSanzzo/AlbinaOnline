import { ReactNode } from "react";
import { ContentsContainer, MainContainer } from "./styledElements";
import PageBanner from "./subComponents/PageBanner";
import PageHeader from "./subComponents/PageHeader";
import { StaticImageData } from "next/image";

interface GenericPageContainerProps {
	children: ReactNode;
	banner: string | StaticImageData;
	favicon: string | StaticImageData;
	title: string;
}

export default function GenericPageContainer({
	children,
	title,
	banner,
	favicon,
}: GenericPageContainerProps) {
	return (
		<MainContainer>
			<PageBanner src={banner} />
			<ContentsContainer>
				<PageHeader
					title={title}
					src={favicon}
				/>
				{children}
			</ContentsContainer>
		</MainContainer>
	);
}
