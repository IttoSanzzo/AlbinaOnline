"use client";
import { ChangeTitleButton } from "./subComponents/ChangeTitleButton";
import { useState } from "react";

interface EditablePageTitleProps {
	originalTitle: string;
	route: string;
	titleChangeBodyPropName?: string;
	onTitleChange?: (title: string) => Promise<void>;
	metadataTag?: string;
	cacheTags?: string[];
	cachePaths?: string[];
}
export function EditablePageTitle({
	originalTitle,
	route,
	titleChangeBodyPropName,
	onTitleChange,
	metadataTag,
	cachePaths,
	cacheTags,
}: EditablePageTitleProps) {
	const [title, setTitle] = useState<string>(originalTitle);

	return (
		<ChangeTitleButton
			setTitle={setTitle}
			title={title}
			route={route}
			titleChangeBodyPropName={titleChangeBodyPropName}
			onTitleChange={onTitleChange}
			metadataTag={metadataTag}
			cachePaths={cachePaths}
			cacheTags={cacheTags}
		/>
	);
}
