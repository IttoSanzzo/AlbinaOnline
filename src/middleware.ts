import {
	stackMiddlewares,
	MiddlewareFactory,
} from "@/middlewares/core/stackHandler";
import { withJwt } from "./middlewares/withJwt";
import { applyIfPathMatch } from "./middlewares/core/withPathFilter";

const middlewares: MiddlewareFactory[] = [
	applyIfPathMatch(["/login", "/register"], withJwt),
];
export default stackMiddlewares(middlewares);
