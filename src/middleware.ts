import {
	stackMiddlewares,
	MiddlewareFactory,
} from "@/middlewares/core/stackHandler";
import { withJwtAccessToken } from "./middlewares/withJwtAccessToken";
import { applyIfPathMatch } from "./middlewares/core/withPathFilter";

const middlewares: MiddlewareFactory[] = [
	applyIfPathMatch(["/login", "/register"], withJwtAccessToken),
];
export default stackMiddlewares(middlewares);
