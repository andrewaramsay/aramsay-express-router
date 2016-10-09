import 'core-js';
if (!Reflect.defineMetadata) {
	require('reflect-metadata');
}

export { Get, Post, Put, Patch, Delete } from './src/metadata';
export { RouteBuilder } from './src/route-builder';
export { ClassFactory } from './src/interfaces';
