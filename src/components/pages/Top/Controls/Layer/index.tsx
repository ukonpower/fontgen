import { useContext } from 'react';

import style from './index.module.scss';

import { Button } from '~/components/ui/Parts/Button';
import { Value } from '~/components/ui/Parts/Property/Value';
import { GLContext } from '~/hooks/useGL';

type LayerProps = {
	index: number;
	point: number[];
};

const PointTypeNameList = [ 'Connect', 'Close' ];

export const Layer = ( props: LayerProps ) => {

	const glContext = useContext( GLContext );

	return <div className={style.layer} data-selected={glContext.gl?.selectedPointIndex == props.index}>
		<div className={style.inner}>
			<div className={style.info} onClick={() => {

				glContext.gl?.selectPoint( props.index );

			}}>
				Layer { props.index }<br/>
				posX: { props.point[ 1 ] }<br/>
				posY: { props.point[ 2 ] }
				<Value value={PointTypeNameList[ props.point[ 0 ] ]} selectList={PointTypeNameList} onChange={( value ) => {

					glContext.gl?.setPointType( props.index, PointTypeNameList.indexOf( value as string ) );

				}} />
			</div>
			<div className={style.add}>
				<div className={style.btn}>
					<Button onClick={() => {

						glContext.gl?.addPoint( props.index );
						glContext.gl?.selectPoint( props.index + 1 );

					}}>↑</Button>
				</div>
				<div className={style.btn}>
					<Button onClick={() => {

						glContext.gl?.deletePoint( props.index );

					}}>X</Button>
				</div>
				<div className={style.btn}>
					<Button onClick={() => {

						glContext.gl?.addPoint( props.index + 1 );

					}}>↓</Button>
				</div>
			</div>
		</div>
	</div>;

};
