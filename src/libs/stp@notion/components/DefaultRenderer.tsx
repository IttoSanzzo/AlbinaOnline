"use client";

import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";
import "./notion.css";
import { NotionComponents, NotionRenderer } from "react-notion-x";
import dynamic from "next/dynamic";
import Image from "next/image";
import styles from "./styles.module.css";
import clsx from "clsx";
import { defaultMapNotionPageUrl } from "../functions/MapPageUrl";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { ExtendedRecordMap } from "notion-types";
import Link, { LinkProps } from "next/link";

const Code = dynamic(() =>
	import("react-notion-x/build/third-party/code").then((m) => m.Code)
);
const Collection = dynamic(() =>
	import("react-notion-x/build/third-party/collection").then(
		(m) => m.Collection
	)
);
const Equation = dynamic(() =>
	import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Pdf = dynamic(
	() => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
	{
		ssr: false,
	}
);
const Modal = dynamic(
	() => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
	{
		ssr: false,
	}
);

export function NoBlankLink({ ...props }: LinkProps) {
	return <Link {...props} />;
}
function EmptyCollectionComponent() {
	return <></>;
}

interface RendererPlugins {
	Code?: boolean;
	Collection?: boolean;
	Equation?: boolean;
	Pdf?: boolean;
	Modal?: boolean;
}
export interface DefaultRendererProps {
	recordMap: ExtendedRecordMap;
	fullPage?: boolean;
	darkMode?: boolean;
	mapLinkImageUrlsToAlbinaApiRoute?: string;
	targetDatabase?: "changelog" | "codex";
	className?: string;
	plugins?: RendererPlugins;
}

export function DefaultRenderer({
	recordMap,
	darkMode = true,
	fullPage = false,
	className,
	targetDatabase,
	mapLinkImageUrlsToAlbinaApiRoute,
	plugins,
}: DefaultRendererProps) {
	const components: Partial<NotionComponents> = {
		nextImage: Image,
		nextLink: NoBlankLink,
		Link: NoBlankLink,
		Code: plugins?.Code ? Code : null,
		Collection:
			plugins?.Collection == true
				? Collection
				: plugins?.Collection != undefined
				? EmptyCollectionComponent
				: undefined,
		Equation: plugins?.Equation ? Equation : null,
		Modal: plugins?.Modal ? Modal : null,
		Pdf: plugins?.Pdf ? Pdf : null,
	};
	return (
		<NotionRenderer
			className={clsx(className, styles.genericNotionXRendererStyle)}
			recordMap={recordMap}
			darkMode={darkMode}
			fullPage={fullPage}
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
			components={components}
		/>
	);
}
