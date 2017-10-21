import * as fs from 'fs-extra';
import * as path from 'path';
import * as pluralize from 'pluralize';
import * as replace from 'replace-in-file';

export async function createFile(
	srcFile: fs.PathLike,
	destDir: string,
	destFilename: string
): Promise<fs.PathLike | undefined> {
	const destFile = path.join(destDir, destFilename);
	try {
		await fs.accessSync(destDir);
	} catch (error) {
		fs.mkdirSync(destDir);
	}

	try {
		await fs.accessSync(destDir);
		await copyFile(srcFile, destFile);
		return destFile;
	} catch (error) {
		return;
	}
}

async function copyFile(
	srcFile: fs.PathLike,
	destFile: fs.PathLike
): Promise<void> {
	await fs.copySync(srcFile.toString(), destFile.toString());
	return;
}

export async function replaceInFile(
	destFile: fs.PathLike,
	moduleName: string
): Promise<void> {
	pluralize.addSingularRule(/singles$/i, 'singular');
	const titleCaseSingular: string = firstToUpperCase(moduleName);
	const titleCasePlural: string = pluralize(titleCaseSingular);
	const lowerCaseSingular: string = firstToLowerCase(moduleName);
	const lowerCasePlural: string = pluralize(lowerCaseSingular);

	// Replace Title Case Plural
	let options = {
		files: destFile,
		from: new RegExp('Templates', 'g'),
		to: titleCasePlural
	};
	let changes = replace.sync(options);

	// Replace Lower Case Plural
	options = {
		files: destFile,
		from: new RegExp('templates', 'g'),
		to: lowerCasePlural
	};
	changes = replace.sync(options);

	// Replace Title Case Singular
	options = {
		files: destFile,
		from: new RegExp('Template', 'g'),
		to: titleCaseSingular
	};
	changes = replace.sync(options);

	// Replace Lower Case Singular
	options = {
		files: destFile,
		from: new RegExp('template', 'g'),
		to: lowerCaseSingular
	};
	changes = replace.sync(options);

	// Replace the Exceptions Reference
	const newOptions = {
		files: destFile,
		from: '../../exceptions',
		to: '../exceptions'
	};
	changes = replace.sync(newOptions);
	return;
}

export function firstToUpperCase(str: string) {
	return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function firstToLowerCase(str: string) {
	return str.substr(0, 1).toLowerCase() + str.substr(1);
}
