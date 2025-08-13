"use client";
import { ChangeTitleButton } from "./subComponents/ChangeTitleButton";
import { useState } from "react";

interface EditablePageTitleProps {
	originalTitle: string;
	route: string;
	titleChangeBodyPropName?: string;
	metadataTag?: string;
}
export function EditablePageTitle({
	originalTitle,
	route,
	titleChangeBodyPropName,
	metadataTag,
}: EditablePageTitleProps) {
	const [title, setTitle] = useState<string>(originalTitle);

	return (
		<ChangeTitleButton
			setTitle={setTitle}
			title={title}
			route={route}
			titleChangeBodyPropName={titleChangeBodyPropName}
			metadataTag={metadataTag}
		/>
	);
}
