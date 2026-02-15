import {
	MiddlewareFactory,
	stackMiddlewares,
	identityGate,
} from "./middlewares";

const middlewares: MiddlewareFactory[] = [identityGate];
export default stackMiddlewares(middlewares);
export const config = {
	matcher: ["/((?!api|_next|.*\\..*).*)"],
};
