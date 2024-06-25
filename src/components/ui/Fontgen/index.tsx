import { useContext, useRef, useEffect } from "react";

import style from './index.module.scss';
import { FontgenContext } from "./useFontgen";


export const GLCanvas = () => {

	const { gl } = useContext( FontgenContext );
	const wrapperElmRef = useRef<HTMLDivElement | null>( null );

	useEffect( () => {

		if ( gl && wrapperElmRef.current ) {

			const canvas = wrapperElmRef.current.querySelectorAll( 'canvas' );
			canvas.forEach( item => item.remove() );
			wrapperElmRef.current.appendChild( gl.canvas );

		}

	}, [ gl ] );

	return <div className={style.glCanvas} ref={wrapperElmRef}></div>;

};
