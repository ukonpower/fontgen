
import { useContext } from 'react';

import style from './index.module.scss';

import { Button } from '~/components/ui/Parts/Button';
import { GLContext } from '~/hooks/useGL';
import { CHARSET } from '~/hooks/useGL/GL';

export const Setting = () => {

	const glContext = useContext( GLContext );

	const onClickChangeChar = ( type: string ) => {

		if ( ! glContext.setting?.currentChar ) return;

		const currnetIndex = CHARSET.indexOf( glContext.setting?.currentChar );

		if ( currnetIndex === - 1 ) return;

		if ( type == "prev" && currnetIndex == 0 ) return;
		if ( type == "next" && currnetIndex == CHARSET.length - 1 ) return;

		glContext.gl?.setChar( CHARSET[ type == "prev" ? currnetIndex - 1 : currnetIndex + 1 ] );

	};

	return <div className={style.setting}>
		<div className={style.controls}>
			<div className={style.btn}>
				<Button onClick={() => {

					onClickChangeChar( "prev" );

				}}>←</Button>
			</div>
			<div className={style.char}>
				{glContext.gl?.setting.currentChar}
			</div>
			<div className={style.btn}>
				<Button onClick={() => {

					onClickChangeChar( "next" );

				}}>→</Button>
			</div>
		</div>
		<div className={style.controls}>
			<div className={style.btn}>
				<Button onClick={() => {

					glContext.gl?.export();

				}}>JSON</Button>
			</div>
			<div className={style.btn}>
				<Button onClick={() => {

					glContext.gl?.exportBase64();

				}}>Base64</Button>
			</div>
		</div>
	</div>;

};
