
import path from 'path';


import react from '@vitejs/plugin-react';
import glslify from 'rollup-plugin-glslify';
import { defineConfig } from 'vite';

const basePath = ``;

// https://vitejs.dev/config/
export default defineConfig( {
	base: "fontgen/",
	root: 'src/pages',
	server: {
		port: 3000,
		host: "0.0.0.0",
	},
	build: {
		outDir: '../../dist/',
	},
	resolve: {
		alias: {
			"~": path.join( __dirname, "src" ),
		},
	},
	plugins: [
		react(),
		{
			...glslify( {
				//@ts-expect-error ummm
				basedir: './src/glsl/',
				transform: [
					[ 'glslify-hex' ],
					[ 'glslify-import' ]
				],
			} ),
			enforce: 'pre'
		}
	],
	define: {
		BASE_PATH: `"${basePath}"`
	}
} );
