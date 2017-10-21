import * as config from 'config';
import * as jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';

/**
 * @swagger
 * definitions:
 *   Token:
 *     type: object
 *     properties:
 *       token:
 *         type: string
 */
export default class Token {
	constructor(token?: string) {
		if (token) {
			this.$token = token;
		}
	}
	private token: string;

	public get $token(): string {
		return this.token;
	}

	public set $token(value: string) {
		this.token = value;
	}

	public generateToken(id: ObjectID) {
		this.$token = jwt.sign(
			{ id: id.toHexString() },
			config.get('server.auth.jwtSecret'),
			this.getTokenSigningOptions()
		);
	}

	private getTokenSigningOptions(): jwt.SignOptions {
		return { expiresIn: config.get('server.auth.jwtExpiresIn') };
	}

	public verifyToken() {
		return jwt.verify(this.$token, config.get('server.auth.jwtSecret'));
	}
}
