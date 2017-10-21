import Template from '../models/Template';
import BaseRepository from './BaseRepository';

export default class TemplateRepository extends BaseRepository<Template> {
	constructor() {
		super(Template.name);
	}
}
