"use client";

import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";
import { NotionComponents, NotionRenderer } from "react-notion-x";
import { ExtendedRecordMap } from "notion-types";
import Link from "next/link";
import Image from "next/image";

export interface DefaultRendererProps {
	recordMap: ExtendedRecordMap;
	fullPage?: boolean;
	darkMode?: boolean;
	className?: string;
}
export function DefaultRenderer({
	recordMap,
	darkMode = true,
	fullPage = false,
	className,
}: DefaultRendererProps) {
	const components: Partial<NotionComponents> = {
		nextImage: Image,
		nextLink: Link,
	};
	return (
		<NotionRenderer
			className={className}
			recordMap={recordMap}
			darkMode={darkMode}
			fullPage={fullPage}
			components={components}
		/>
	);
}
