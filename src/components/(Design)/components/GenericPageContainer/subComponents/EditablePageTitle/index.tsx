"use client";
import { ChangeTitleButton } from "./subComponents/ChangeTitleButton";
import { useState } from "react";

interface EditablePageTitleProps {
	originalTitle: string;
	route: string;
}
export function EditablePageTitle({
	originalTitle,
	route,
}: EditablePageTitleProps) {
	const [title, setTitle] = useState<string>(originalTitle);

	return (
		<ChangeTitleButton
			setTitle={setTitle}
			title={title}
			route={route}
		/>
	);
}
