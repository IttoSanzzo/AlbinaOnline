import { Metadata } from "next";
import { metadataMap } from "./metadata";
import { cache } from "react";
import { LintIgnoredAny } from "@/libs/stp@types";

export const resolveMetadata = cache(
	async (route: string): Promise<Metadata | undefined> => {
		let routeModuleFn: (() => Promise<LintIgnoredAny>) | undefined =
			metadataMap[route];
		const params: Record<string, string | string[]> = {};

		if (!routeModuleFn) {
			for (const routePattern in metadataMap) {
				if (routePattern.includes("[")) {
					const paramNames: string[] = [];

					const regexPattern =
						"^" +
						routePattern
							.replace(/\[\.\.\.([^\]]+)\]/g, (_, name) => {
								paramNames.push(name);
								return "(.+)";
							})
							.replace(/\[([^\]]+)\]/g, (_, name) => {
								paramNames.push(name);
								return "([^/]+)";
							}) +
						"$";

					const match = route.match(new RegExp(regexPattern));
					if (match) {
						routeModuleFn = metadataMap[routePattern];
						paramNames.forEach((name, i) => {
							const value = match[i + 1];
							const isCatchAll = routePattern.includes(`[...${name}]`);
							params[name] = isCatchAll ? value.split("/") : value;
						});
						break;
					}
				}
			}
		}
		if (!routeModuleFn) return undefined;
		try {
			const routeModule = await routeModuleFn();
			if (routeModule.metadata) return routeModule.metadata;
			if (routeModule.generateMetadata)
				return routeModule.generateMetadata({ params, searchParams: {} });
		} catch {
			return undefined;
		}
	}
);
