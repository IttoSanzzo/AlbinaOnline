import React, { ReactNode } from "react";
import { PageBanner } from "./subComponents/PageBanner";
import { PageHeader } from "./subComponents/PageHeader";
import { StaticImageData } from "next/image";
import AlbinaLogo from "@/../public/Mock/AlbinaLogo.png";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import { EditablePageBanner } from "./subComponents/EditablePageBanner";

export const MainContainer = newStyledElement.div(styles.mainContainer);
export const ContentsContainer = newStyledElement.div(styles.contentsContainer);

interface GenericPageContainerProps {
	children: ReactNode;
	banner?: string;
	icon?: string;
	borderColor?: string;
	title: string;
	isEditable?: boolean;
	bannerChangeRoute?: string;
	iconChangeRoute?: string;
	titleChangeRoute?: string;
	titleChangeBodyPropName?: string;
	subTitle?: ReactNode;
}

export function GenericPageContainer({
	children,
	title,
	banner,
	icon,
	borderColor,
	isEditable = false,
	bannerChangeRoute,
	iconChangeRoute,
	titleChangeRoute,
	titleChangeBodyPropName,
	subTitle,
}: GenericPageContainerProps) {
	return (
		<MainContainer>
			{isEditable && bannerChangeRoute && bannerChangeRoute !== "" ? (
				<EditablePageBanner
					route={bannerChangeRoute}
					bannerSrc={banner ?? ""}
				/>
			) : (
				<PageBanner bannerSrc={banner ? banner : AlbinaLogo} />
			)}

			<ContentsContainer>
				<PageHeader
					isEditable={isEditable}
					iconChangeRoute={iconChangeRoute}
					titleChangeRoute={titleChangeRoute}
					titleChangeBodyPropName={titleChangeBodyPropName}
					title={title}
					icon={icon ? icon : "/Mock/AlbinaLogo.png"}
					borderColor={borderColor}
					subTitle={subTitle}
				/>
				{children}
			</ContentsContainer>
		</MainContainer>
	);
}
