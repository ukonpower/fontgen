import { useContext } from 'react';

import style from './index.module.scss';

import { Button } from '~/components/ui/Parts/Button';
import { Value } from '~/components/ui/Parts/Property/Value';
import { GLContext } from '~/hooks/useGL';
import { PointTypeList } from '~/hooks/useGL/GL/FontRenderer';

type LayerProps = {
	index: number;
	point: number[];
};


export const Layer = ( props: LayerProps ) => {

	const glContext = useContext( GLContext );

	const type = props.point[ 0 ];
	const pos = [ props.point[ 1 ], props.point[ 2 ] ];

	return <div className={style.layer} data-selected={glContext.gl?.selectedPointIndex == props.index} data-layer={props.index}>
		<div className={style.inner}>
			<div className={style.info} onClick={() => {

				glContext.gl?.selectPoint( props.index );

			}}>
				Layer { props.index }<br/>
				posX: { pos[ 0 ] }<br/>
				posY: { pos[ 1 ] }
				<Value value={PointTypeList[ type ]} selectList={PointTypeList} onChange={( value ) => {

					glContext.gl?.setPointType( props.index, PointTypeList.indexOf( value as string ) );

				}} />
			</div>
			<div className={style.add}>
				<div className={style.btn}>
					<Button onClick={() => {

						glContext.gl?.addPoint( props.index, pos );
						glContext.gl?.selectPoint( props.index );

					}}>↑</Button>
				</div>
				<div className={style.btn}>
					<Button onClick={() => {

						glContext.gl?.deletePoint( props.index );

					}}>X</Button>
				</div>
				<div className={style.btn}>
					<Button onClick={() => {

						glContext.gl?.addPoint( props.index + 1, pos );

					}}>↓</Button>
				</div>
			</div>
		</div>
	</div>;

};
