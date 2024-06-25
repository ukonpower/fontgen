import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { FontgenCore, EditorSetting } from './FontgenCore';


export type TFontgenContext = HooksContext<typeof useFontgen>;
export const FontgenContext = createContext<TFontgenContext>( {} );

export const useFontgen = () => {

	const [ gl, setGL ] = useState<FontgenCore>();

	const [ selectedPointIndex, setSelectedPointIndex ] = useState<number>( 0 );
	const [ setting, setSetting ] = useState<EditorSetting>( );
	const [ visibleList, setVisibleList ] = useState( false );

	useEffect( () => {

		const gl = new FontgenCore();
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
		currentPath,
		visibleList,
		setVisibleList
	};

};
