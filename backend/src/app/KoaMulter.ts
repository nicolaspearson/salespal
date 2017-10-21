import * as path from 'path';

export class KoaMulter {
	public static getKoaMulterOptions(): any {
		return {
			dest: path.resolve('./tmp/uploads/'),
			limits: {
				fieldNameSize: 255,
				fileSize: 1024 * 1024 * 10 // 10 MB
			}
		};
	}
}
