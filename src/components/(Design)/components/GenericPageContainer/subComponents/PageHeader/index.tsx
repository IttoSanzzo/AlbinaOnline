import Image from "next/image";
import { EditablePageIcon } from "../EditablePageIcon";
import { EditablePageTitle } from "../EditablePageTitle";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { ReactNode } from "react";

export const PageHeaderContainer = newStyledElement.div(
	styles.pageHeaderContainer
);
export const TitlesContainer = newStyledElement.div(styles.titlesContainer);
export const PageTitle = newStyledElement.h1(styles.pageTitle);
export const SubTitleContainer = newStyledElement.div(styles.subTitleContainer);

interface PageHeaderProps {
	isEditable: boolean;
	title: string;
	icon: string;
	borderColor?: string;
	iconChangeRoute?: string;
	titleChangeRoute?: string;
	subTitle?: ReactNode;
}
export function PageHeader({
	isEditable,
	title,
	icon,
	borderColor,
	iconChangeRoute,
	titleChangeRoute,
	subTitle,
}: PageHeaderProps) {
	const finalIcon = `${icon}?size=64`;

	return (
		<PageHeaderContainer>
			{isEditable && iconChangeRoute && iconChangeRoute !== "" ? (
				<EditablePageIcon
					iconSrc={icon}
					route={iconChangeRoute}
				/>
			) : (
				<Image
					src={finalIcon}
					alt="Page's favicon"
					width={512}
					height={512}
					quality={100}
					style={
						borderColor ? { backgroundColor: `${borderColor}40` } : undefined
					}
				/>
			)}
			<TitlesContainer>
				{isEditable && titleChangeRoute && titleChangeRoute !== "" ? (
					<EditablePageTitle
						originalTitle={title}
						route={titleChangeRoute}
					/>
				) : (
					<PageTitle>{title}</PageTitle>
				)}
				{subTitle && <SubTitleContainer>{subTitle}</SubTitleContainer>}
			</TitlesContainer>
		</PageHeaderContainer>
	);
}
