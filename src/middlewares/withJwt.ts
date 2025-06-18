import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareFactory } from "./core/stackHandler";

export const withJwt: MiddlewareFactory = (next) => {
	return async (request: NextRequest, event: NextFetchEvent) => {
		const token = request.cookies.get("jwt")?.value;
		if (token) {
			return NextResponse.redirect(new URL("/", request.url));
		}
		return next(request, event);
	};
};
