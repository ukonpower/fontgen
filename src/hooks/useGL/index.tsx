import { createContext, useCallback, useEffect, useState } from 'react';

import { GL } from './GL';

export type TGLContext = HooksContext<typeof useGL>;
export const GLContext = createContext<TGLContext>( {} );

export const useGL = () => {

	const [ gl, setGL ] = useState<GL>();

	const [ fontPath, setFontPath ] = useState<number[]>( [] );
	const [ selectedPointIndex, setSelectedPointIndex ] = useState<number>( 0 );

	useEffect( () => {

		const gl = new GL();
		setGL( gl );

		// path

		const onUpdatePath = ( path: number[] ) => {

			setFontPath( path );

		};

		onUpdatePath( gl.fontPath );

		gl.addListener( 'update/path', onUpdatePath );

		// selected

		const onSelectPoint = ( index: number ) => {

			setSelectedPointIndex( index );

		};

		onSelectPoint( gl.selectedPointIndex );

		gl.addListener( 'update/point/select', onSelectPoint );

		return () => {

			gl.removeListener( 'update/path', onUpdatePath );
			gl.removeListener( 'update/point/select', onSelectPoint );

			gl.dispose();
			setGL( undefined );

		};

	}, [] );


	return {
		gl,
		fontPath,
		selectedPointIndex,
	};

};
