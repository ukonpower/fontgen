import { createContext, useCallback, useEffect, useState } from 'react';

import { GL } from './GL';

export type TGLContext = HooksContext<typeof useGL>;
export const GLContext = createContext<TGLContext>( {} );

export const useGL = () => {

	const [ gl, setGL ] = useState<GL>();

	const [ fontPath, setFontPath ] = useState<number[]>( [] );


	useEffect( () => {

		const gl = new GL();
		setGL( gl );

		const onUpdatePath = ( path: number[] ) => {

			console.log( path );

			setFontPath( path );

		};

		onUpdatePath( gl.fontPath );

		gl.addListener( 'update/path', onUpdatePath );

		return () => {

			gl.removeListener( 'update/path', onUpdatePath );

			gl.dispose();
			setGL( undefined );

		};

	}, [] );


	return {
		gl,
		fontPath
	};

};
