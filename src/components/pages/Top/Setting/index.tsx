
import { useContext } from 'react';

import style from './index.module.scss';

import { Button } from '~/components/ui/Parts/Button';
import { GLContext } from '~/hooks/useGL';

export const Setting = ( ) => {

	const glContext = useContext( GLContext );

	return <div className={style.setting}>
		<div className={style.info}>
			{glContext.gl?.setting.currentChar}
		</div>
		<div className={style.controls}>
			<div className={style.btn}>
				<Button>←</Button>
			</div>
			<div className={style.btn}>
				<Button>→</Button>
			</div>
		</div>
	</div>;

};
