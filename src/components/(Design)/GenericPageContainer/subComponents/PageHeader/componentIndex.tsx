import Image, { StaticImageData } from "next/image";
import { PageHeaderContainer, PageTitle } from "./styledElements";

interface PageHeaderProps {
	title: string;
	src: string | StaticImageData;
}

export default function PageHeader({ title, src }: PageHeaderProps) {
	return (
		<PageHeaderContainer>
			<Image
				src={src}
				alt="Page's favicon"
			/>
			<PageTitle>{title}</PageTitle>
		</PageHeaderContainer>
	);
}
