import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareFactory } from "./core/stackHandler";

export const identityGate: MiddlewareFactory = (next) => {
	return async (request: NextRequest, event: NextFetchEvent) => {
		const pathname = request.nextUrl.pathname;
		// console.log(`[MIDDLING FOR ${pathname}]`);
		if (pathname === "/") return next(request, event);
		const refreshToken = request.cookies.get("jwt-refresh-token")?.value;
		if (["/login", "/register"].includes(pathname)) {
			if (!!refreshToken) {
				return NextResponse.redirect(new URL("/home", request.url));
			}
		} else {
			if (!refreshToken) {
				return NextResponse.redirect(
					new URL(`/login?redirectTo=${pathname}`, request.url)
				);
			}
		}
		return next(request, event);
	};
};
