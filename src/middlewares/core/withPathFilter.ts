import { MiddlewareFactory } from "./stackHandler";
import { NextFetchEvent, NextRequest } from "next/server";

export function applyIfPathMatch(
	paths: string[] | ((pathname: string) => boolean),
	middleware: MiddlewareFactory
): MiddlewareFactory {
	return (next) => {
		const wrapped = middleware(next);
		return async (req: NextRequest, event: NextFetchEvent) => {
			const pathname = req.nextUrl.pathname;
			const matches =
				typeof paths === "function"
					? paths(pathname)
					: paths.includes(pathname);
			if (!matches) return next(req, event);
			return wrapped(req, event);
		};
	};
}
