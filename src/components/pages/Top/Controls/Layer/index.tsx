import { useContext } from 'react';

import style from './index.module.scss';

import { FontgenContext } from '~/components/ui/Fontgen/useFontgen';
import { PointTypeList } from '~/components/ui/Fontgen/useFontgen/FontgenCore/FontRenderer';
import { Button } from '~/components/ui/Parts/Button';
import { Value } from '~/components/ui/Parts/Property/Value';

type LayerProps = {
	index: number;
	point: number[];
};


export const Layer = ( props: LayerProps ) => {

	const fontgenContext = useContext( FontgenContext );
	const type = props.point[ 0 ];

	return <div className={style.layer} data-selected={fontgenContext.gl?.selectedPointIndex == props.index} data-layer={props.index}>
		<div className={style.inner}>
			<div className={style.info} onClick={() => {

				fontgenContext.gl?.selectPoint( props.index );

			}}>
				<div className={style.label}>
					Point: { props.index }
				</div>
				<div className={style.type}>
					<Value value={PointTypeList[ type ]} selectList={PointTypeList} onChange={( value ) => {

						fontgenContext.gl?.setPointType( props.index, PointTypeList.indexOf( value as string ) );

					}} />
				</div>
			</div>
			<div className={style.controls}>
				<div className={style.btn}>
					<Button onClick={() => {

						fontgenContext.gl?.deletePoint( props.index );

					}}>X</Button>
				</div>
			</div>
		</div>
	</div>;

};
