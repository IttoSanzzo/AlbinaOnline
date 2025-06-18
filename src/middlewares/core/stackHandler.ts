import {
	NextFetchEvent,
	NextMiddleware,
	NextRequest,
	NextResponse,
} from "next/server";

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

export function stackMiddlewares(
	functions: MiddlewareFactory[] = [],
	index = 0
): NextMiddleware {
	const current = functions[index];
	if (current) {
		const next = stackMiddlewares(functions, index + 1);
		return current(next);
	}
	return (request: NextRequest, event: NextFetchEvent) => NextResponse.next();
}
