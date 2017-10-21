import { ObjectID } from 'mongodb';
import { FindOneOptions, getManager, QueryFailedError } from 'typeorm';
import {
	BadRequestError,
	HttpError,
	InternalServerError,
	NotFoundError
} from '../../exceptions';

export default abstract class BaseRepository<T> {
	private entityName: string;

	constructor(entityName: string) {
		this.entityName = entityName;
	}

	protected getRepository() {
		return getManager().getMongoRepository(this.entityName);
	}

	/**
	 * This function wraps the execution of all repository calls
	 * in a generic try-catch in order to decrease duplication,
	 * and centralize error handling. All calls to the repository
	 * should be wrapped in this function
	 *
	 * @param repositoryFunction Promise<any>: The repository function that should be executed
	 */
	public async executeRepositoryFunction(
		repositoryFunction: Promise<any>
	): Promise<any> {
		try {
			return await repositoryFunction;
		} catch (error) {
			if (error instanceof HttpError) {
				throw error;
			}
			if (error instanceof QueryFailedError) {
				throw new InternalServerError(error.message);
			}
			throw new BadRequestError(error);
		}
	}

	public async getAll(): Promise<T[]> {
		return await this.executeRepositoryFunction(this.getRepository().find());
	}

	public async findOneById(id: ObjectID): Promise<T> {
		const record = await this.executeRepositoryFunction(
			this.getRepository().findOneById(id)
		);
		if (!record) {
			throw new NotFoundError(`The requested record was not found: ${id}`);
		}
		return record;
	}

	public async findOneByFilter(filter: FindOneOptions<T>): Promise<T> {
		const record = await this.executeRepositoryFunction(
			this.getRepository().findOne(filter)
		);
		if (!record) {
			throw new NotFoundError(`The requested record was not found`);
		}
		return record;
	}

	public async save(record: T): Promise<T> {
		return await this.executeRepositoryFunction(
			this.getRepository().save(record)
		);
	}

	public async updateOneById(id: ObjectID, record: T): Promise<T> {
		const foundRecord = await this.findOneById(id);
		if (!foundRecord) {
			throw new NotFoundError(`The requested record was not found: ${id}`);
		}
		await this.executeRepositoryFunction(this.getRepository().save(record));
		return record;
	}

	public async delete(record: T) {
		return await this.executeRepositoryFunction(
			this.getRepository().remove(record)
		);
	}

	public async deleteOneWithId(id: ObjectID): Promise<T> {
		const record = await this.findOneById(id);
		if (!record) {
			throw new NotFoundError(`The requested record was not found: ${id}`);
		}
		return await this.delete(record);
	}
}
