import { EditablePageIcon } from "../EditablePageIcon";
import { EditablePageTitle } from "../EditablePageTitle";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { ReactNode } from "react";
import { PageIcon } from "../PageIcon";

const PageHeaderContainer = newStyledElement.div(styles.pageHeaderContainer);
const TitlesContainer = newStyledElement.div(styles.titlesContainer);
const SubTitlesContainer = newStyledElement.div(styles.subTitlesContainer);
const SubTitleContainer = newStyledElement.div(styles.subTitleContainer);
export const PageTitle = newStyledElement.h1(styles.pageTitle);

interface PageHeaderProps {
	isEditable: boolean;
	title: string;
	icon: string;
	borderColor?: string;
	borderOpacity: number;
	iconChangeRoute?: string;
	titleChangeRoute?: string;
	titleChangeBodyPropName?: string;
	subTitle?: ReactNode;
	subTitle2?: ReactNode;
	metadataTag?: string;
	cacheTags?: string[];
	cachePaths?: string[];
}
export function PageHeader({
	isEditable,
	title,
	icon,
	borderColor,
	borderOpacity,
	iconChangeRoute,
	titleChangeRoute,
	titleChangeBodyPropName,
	subTitle,
	subTitle2,
	metadataTag,
	cachePaths,
	cacheTags,
}: PageHeaderProps) {
	return (
		<PageHeaderContainer>
			{isEditable && iconChangeRoute && iconChangeRoute !== "" ? (
				<EditablePageIcon
					iconSrc={icon}
					route={iconChangeRoute}
					borderColor={borderColor}
					borderOpacity={borderOpacity}
					cachePaths={cachePaths}
					cacheTags={cacheTags}
				/>
			) : (
				<PageIcon
					iconSrc={icon}
					borderColor={borderColor}
					borderOpacity={borderOpacity}
				/>
			)}
			<TitlesContainer>
				{isEditable && titleChangeRoute && titleChangeRoute !== "" ? (
					<EditablePageTitle
						originalTitle={title}
						route={titleChangeRoute}
						titleChangeBodyPropName={titleChangeBodyPropName}
						metadataTag={metadataTag}
						cachePaths={cachePaths}
						cacheTags={cacheTags}
					/>
				) : (
					<PageTitle>{title}</PageTitle>
				)}
				{(subTitle || subTitle2) && (
					<SubTitlesContainer>
						{subTitle && <SubTitleContainer>{subTitle}</SubTitleContainer>}
						{subTitle2 && <SubTitleContainer>{subTitle2}</SubTitleContainer>}
					</SubTitlesContainer>
				)}
			</TitlesContainer>
		</PageHeaderContainer>
	);
}
