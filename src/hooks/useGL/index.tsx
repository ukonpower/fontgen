import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { EditorSetting, GL } from './GL';

export type TGLContext = HooksContext<typeof useGL>;
export const GLContext = createContext<TGLContext>( {} );

export const useGL = () => {

	const [ gl, setGL ] = useState<GL>();

	const [ selectedPointIndex, setSelectedPointIndex ] = useState<number>( 0 );
	const [ setting, setSetting ] = useState<EditorSetting>( );

	useEffect( () => {

		const gl = new GL();
		setGL( gl );

		// selected

		const onSelectPoint = ( index: number ) => {

			setSelectedPointIndex( index );

		};

		if ( gl.selectedPointIndex ) {

			onSelectPoint( gl.selectedPointIndex );

		}

		gl.addListener( 'update/point/select', onSelectPoint );

		// setting

		const onUpdateSetting = ( setting : EditorSetting ) => {

			setSetting( setting );

		};

		onUpdateSetting( gl.setting );

		gl.addListener( 'update/setting', onUpdateSetting );

		return () => {

			gl.removeListener( 'update/point/select', onSelectPoint );
			gl.removeListener( 'update/setting', onUpdateSetting );

			gl.dispose();
			setGL( undefined );

		};

	}, [] );

	const currentPath = useMemo( () => {

		return ( setting?.pathList[ setting.currentChar ] || [] ).concat();

	}, [ setting ] );


	return {
		gl,
		selectedPointIndex,
		setting,
		currentPath
	};

};
