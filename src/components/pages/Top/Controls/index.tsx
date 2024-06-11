
import style from './index.module.scss';
import { Layer } from './Layer';

type ControlsProps = {
	fontPath: number[];
};

export const Controls = ( props: ControlsProps ) => {

	const fontPath = props.fontPath;
	const pahts = [];

	for ( let i = 0; i < fontPath.length / 3; i ++ ) {

		pahts.push( [ fontPath[ i * 3 ], fontPath[ i * 3 + 1 ], fontPath[ i * 3 + 2 ] ] );

	}

	return <div className={style.controls}>
		<div className={style.layers}>

			{
				pahts.map( ( path, index ) => {

					return <Layer key={index} index={index} path={path} />;

				} )
			}
		</div>
	</div>;

};
