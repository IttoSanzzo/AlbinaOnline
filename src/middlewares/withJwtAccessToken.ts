import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { MiddlewareFactory } from "./core/stackHandler";

export const withJwtAccessToken: MiddlewareFactory = (next) => {
	return async (request: NextRequest, event: NextFetchEvent) => {
		const token = request.cookies.get("jwt-access-token")?.value;
		// console.log(token);
		if (token) {
			return NextResponse.redirect(new URL("/", request.url));
		}
		return next(request, event);
	};
};
