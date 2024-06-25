import React, { useContext, useEffect, useRef, useState } from 'react';

import { FontgenContext } from '../Fontgen/useFontgen';

import { FontListViewCore } from './core';
import style from './index.module.scss';


export const FontListView: React.FC = ( ) => {

	const { visibleList } = useContext( FontgenContext );

	const [ view, setView ] = useState<FontListViewCore | null>( null );

	const containerRef = useRef<HTMLDivElement>( null );

	useEffect( () => {

		const view = new FontListViewCore();

		setView( view );

		const wrapper = containerRef.current;

		if ( wrapper ) {

			wrapper.appendChild( view.canvas );

		}

		return () => {

			view.dispose();

			view.canvas.remove();

			setView( null );

		};

	}, [] );

	useEffect( () => {

		if ( view && visibleList ) {

			view.render();

		}

	}, [ view, visibleList ] );


	return <div className={style.view} ref={containerRef} data-visible={visibleList}>
	</div>;

};
