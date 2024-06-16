
import { useContext, useEffect, useReducer, useRef } from 'react';

import style from './index.module.scss';
import { Layer } from './Layer';

import { GLContext } from '~/hooks/useGL';

type ControlsProps = {
	fontPath: number[];
};

export const Controls = ( props: ControlsProps ) => {

	const glContext = useContext( GLContext );

	const fontPath = props.fontPath;
	const paths = [];

	for ( let i = 0; i < fontPath.length / 3; i ++ ) {

		paths.push( [ fontPath[ i * 3 ], fontPath[ i * 3 + 1 ], fontPath[ i * 3 + 2 ] ] );

	}

	const layersElmRef = useRef<HTMLDivElement>( null );
	const selectedPointIndexRef = useRef<number>( 0 );
	selectedPointIndexRef.current = glContext.gl?.selectedPointIndex || 0;

	useEffect( () => {

		if ( layersElmRef.current ) {

			const currentElm = layersElmRef.current.querySelector( `[data-layer="${selectedPointIndexRef.current}"]` );

			if ( currentElm ) {

				currentElm.scrollIntoView( { block: 'center', behavior: "smooth" }	);

			}

		}


	}, [ paths.length ] );

	return <div className={style.controls}>
		<div className={style.layers} ref={layersElmRef}>

			{
				paths.map( ( path, index ) => {

					return <Layer key={index} index={index} point={path} />;

				} )
			}
		</div>
	</div>;

};
