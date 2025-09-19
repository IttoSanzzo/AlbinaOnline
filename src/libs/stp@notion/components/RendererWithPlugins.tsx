"use client";

import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "katex/dist/katex.min.css";
import { NotionComponents, NotionRenderer } from "react-notion-x";
import dynamic from "next/dynamic";
import Image from "next/image";
import { DefaultRendererProps, NoBlankLink } from "./DefaultRenderer";
import styles from "./styles.module.css";
import clsx from "clsx";
import { defaultMapNotionPageUrl } from "../functions/MapPageUrl";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { ExtendedRecordMap } from "notion-types";

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

interface RendererPlugins {
	Code?: boolean;
	Collection?: boolean;
	Equation?: boolean;
	Pdf?: boolean;
	Modal?: boolean;
}

interface RendererWithPluginsProps extends DefaultRendererProps {
	plugins?: RendererPlugins;
}
export function RendererWithPlugins({
	recordMap,
	darkMode = true,
	fullPage = false,
	className,
	targetDatabase,
	mapLinkImageUrlsToAlbinaApiRoute,
	plugins,
}: RendererWithPluginsProps) {
	const components: Partial<NotionComponents> = {
		nextImage: Image,
		nextLink: NoBlankLink,
		Link: NoBlankLink,
		Code: plugins?.Code ? Code : undefined,
		Collection: plugins?.Collection ? Collection : undefined,
		Equation: plugins?.Equation ? Equation : undefined,
		Modal: plugins?.Modal ? Modal : undefined,
		Pdf: plugins?.Pdf ? Pdf : undefined,
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
