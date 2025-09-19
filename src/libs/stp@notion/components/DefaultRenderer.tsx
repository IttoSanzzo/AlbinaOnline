"use client";

import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";
import { NotionComponents, NotionRenderer } from "react-notion-x";
import { ExtendedRecordMap } from "notion-types";
import Link, { LinkProps } from "next/link";
import Image from "next/image";
import styles from "./styles.module.css";
import clsx from "clsx";
import { defaultMapNotionPageUrl } from "../functions/MapPageUrl";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";

export function NoBlankLink({ ...props }: LinkProps) {
	return <Link {...props} />;
}

export interface DefaultRendererProps {
	recordMap: ExtendedRecordMap;
	fullPage?: boolean;
	darkMode?: boolean;
	mapLinkImageUrlsToAlbinaApiRoute?: string;
	targetDatabase?: "changelog" | "codex";
	className?: string;
}
export function DefaultRenderer({
	recordMap,
	darkMode = true,
	fullPage = false,
	mapLinkImageUrlsToAlbinaApiRoute,
	targetDatabase,
	className,
}: DefaultRendererProps) {
	const components: Partial<NotionComponents> = {
		nextImage: Image,
		nextLink: NoBlankLink,
		Link: NoBlankLink,
	};
	return (
		<NotionRenderer
			className={clsx(className, styles.genericNotionXRendererStyle)}
			recordMap={recordMap}
			darkMode={darkMode}
			fullPage={fullPage}
			components={components}
			mapPageUrl={(
				pageId: string,
				recordMap?: ExtendedRecordMap | undefined
			) => {
				return defaultMapNotionPageUrl(pageId, recordMap, targetDatabase);
			}}
			mapImageUrl={
				mapLinkImageUrlsToAlbinaApiRoute
					? () => getAlbinaApiAddress(mapLinkImageUrlsToAlbinaApiRoute)
					: undefined
			}
		/>
	);
}
