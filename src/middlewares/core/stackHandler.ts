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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (_request: NextRequest, _event: NextFetchEvent) => NextResponse.next();
}
