import { KoaMiddlewareInterface, Middleware } from 'routing-controllers';
import * as Exceptions from '../../exceptions';

@Middleware({ type: 'before' })
export class ErrorMiddleware implements KoaMiddlewareInterface {
	public async use(
		ctx: any,
		next: (error?: any) => Promise<any>
	): Promise<any> {
		try {
			await next();
		} catch (error) {
			let httpError: Exceptions.HttpError = new Exceptions.InternalServerError(
				'An unknown internal server error occurred'
			);
			if (error) {
				if (!(error instanceof Exceptions.HttpError)) {
					const statusCode = error.status || error.httpCode || 500;
					switch (statusCode) {
						case 400:
							httpError = new Exceptions.BadRequestError(
								error.message || error
							);
							break;

						case 401:
							httpError = new Exceptions.UnauthorizedError(
								error.message || error
							);
							break;

						case 403:
							httpError = new Exceptions.ForbiddenError(error.message || error);
							break;

						case 404:
							httpError = new Exceptions.NotFoundError(error.message || error);
							break;

						case 405:
							httpError = new Exceptions.MethodNotAllowedError(
								error.message || error
							);
							break;

						case 406:
							httpError = new Exceptions.NotAcceptableError(
								error.message || error
							);
							break;

						case 504:
							httpError = new Exceptions.GatewayTimeoutError(
								error.message || error
							);
							break;

						case 500:
						default:
							httpError = new Exceptions.InternalServerError(
								error.message || error
							);
							break;
					}
				} else {
					httpError = error;
				}
			}
			ctx.status = httpError.status;
			ctx.body = JSON.stringify(httpError);
			ctx.app.emit('error', httpError, ctx);
		}
	}
}
