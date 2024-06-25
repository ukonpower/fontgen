
import { useContext, useEffect, useMemo, useReducer, useRef } from 'react';

import style from './index.module.scss';
import { Layer } from './Layer';

import { FontgenContext } from '~/components/ui/Fontgen/useFontgen';
import { Button } from '~/components/ui/Parts/Button';

export const Controls = ( ) => {

	const fontgenContext = useContext( FontgenContext );

	const paths = useMemo( () => {

		const fontPath = fontgenContext.currentPath;

		const paths = [];

		if ( fontPath ) {

			for ( let i = 0; i < fontPath.length / 3; i ++ ) {

				paths.push( [ fontPath[ i * 3 ], fontPath[ i * 3 + 1 ], fontPath[ i * 3 + 2 ] ] );

			}

		}

		return paths;

	}, [ fontgenContext.currentPath ] );


	const layersElmRef = useRef<HTMLDivElement>( null );
	const selectedPointIndexRef = useRef<number>( 0 );
	selectedPointIndexRef.current = fontgenContext.gl?.selectedPointIndex || 0;

	useEffect( () => {

		if ( layersElmRef.current ) {

			const currentElm = layersElmRef.current.querySelector( `[data-layer="${selectedPointIndexRef.current}"]` );

			if ( currentElm ) {

				currentElm.scrollIntoView( { block: 'center', behavior: "smooth" }	);

			}

		}


	}, [ paths.length ] );

	const selectedPoint = fontgenContext.gl?.selectedPoint || null;
	const selectedPointIndex = fontgenContext.gl?.selectedPointIndex || null;
	const selectedPointPos = selectedPoint && [ selectedPoint[ 1 ], selectedPoint[ 2 ] ] || undefined;

	return <div className={style.controls}>
		<div className={style.head}>
			<div className={style.add}>
				<div className={style.add_btn}>
					<Button onClick={()=>{

						if ( selectedPointIndex !== null ) {

							fontgenContext.gl?.addPoint( selectedPointIndex, selectedPointPos );

						} else {

							fontgenContext.gl?.addPoint( 0 );

						}

					}}>↑</Button>
				</div>
				<div className={style.add_btn}>
					<Button onClick={()=>{

						if ( selectedPointIndex !== null ) {

							fontgenContext.gl?.addPoint( selectedPointIndex + 1, selectedPointPos );

						} else {

							fontgenContext.gl?.addPoint( 0 );

						}

					}}>↓</Button>
				</div>
			</div>
		</div>
		<div className={style.layers} ref={layersElmRef}>
			{
				paths.map( ( path, index ) => {

					return <Layer key={index} index={index} point={path} />;

				} )
			}
		</div>
	</div>;

};
