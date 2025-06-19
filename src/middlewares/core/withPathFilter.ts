import { MiddlewareFactory } from "./stackHandler";
import { NextFetchEvent, NextRequest } from "next/server";

export function applyIfPathMatches(
	paths: string[] | ((pathname: string) => boolean),
	middleware: MiddlewareFactory
): MiddlewareFactory {
	return (next) => {
		const wrapped = middleware(next);
		return async (req: NextRequest, event: NextFetchEvent) => {
			if (req.method !== "GET") return next(req, event);
			const acceptsHtml = req.headers.get("accept")?.includes("text/html");
			if (!acceptsHtml) return next(req, event);

			const pathname = req.nextUrl.pathname;

			if (
				pathname.startsWith("/_next") ||
				pathname.startsWith("/api") ||
				pathname.startsWith("/favicon") ||
				pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|otf)$/)
			) {
				return next(req, event);
			}

			const matches =
				!!pathname &&
				(typeof paths === "function"
					? paths(pathname)
					: paths.includes(pathname));
			if (!matches) return next(req, event);
			return wrapped(req, event);
		};
	};
}
