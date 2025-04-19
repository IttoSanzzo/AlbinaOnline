import Image, { StaticImageData } from "next/image";
import { PageHeaderContainer, PageTitle } from "./styledElements";

interface PageHeaderProps {
	title: string;
	icon: string;
}

export function PageHeader({ title, icon }: PageHeaderProps) {
	const finalIcon = icon[0] === "/" ? icon : `${icon}?size=64`;
	return (
		<PageHeaderContainer>
			<Image
				src={finalIcon}
				alt="Page's favicon"
				width={64}
				height={64}
			/>
			<PageTitle>{title}</PageTitle>
		</PageHeaderContainer>
	);
}
