
import { useContext } from 'react';

import style from './index.module.scss';

import { FontgenContext } from '~/components/ui/Fontgen/useFontgen';
import { CHARSET } from '~/components/ui/Fontgen/useFontgen/FontgenCore';
import { Button } from '~/components/ui/Parts/Button';
import { Value, ValueType } from '~/components/ui/Parts/Property/Value';

export const Setting = () => {

	const fontgenContext = useContext( FontgenContext );

	const onClickChangeChar = ( type: string ) => {

		if ( ! fontgenContext.setting?.currentChar ) return;

		const currnetIndex = CHARSET.indexOf( fontgenContext.setting?.currentChar );

		if ( currnetIndex === - 1 ) return;

		if ( type == "prev" && currnetIndex == 0 ) return;
		if ( type == "next" && currnetIndex == CHARSET.length - 1 ) return;

		fontgenContext.gl?.setChar( CHARSET[ type == "prev" ? currnetIndex - 1 : currnetIndex + 1 ] );

	};

	return <div className={style.setting}>
		<div className={style.controls}>
			<div className={style.btn}>
				<Button onClick={() => {

					onClickChangeChar( "prev" );

				}}>←</Button>
			</div>
			<div className={style.char}>
				{fontgenContext.gl?.setting.currentChar}
			</div>
			<div className={style.btn}>
				<Button onClick={() => {

					onClickChangeChar( "next" );

				}}>→</Button>
			</div>
		</div>
		<div className={style.controls}>
			<div className={style.check}>
				<Value label='VIEW LIST' value={fontgenContext.visibleList || false} onChange={( value ) => {

					fontgenContext && fontgenContext.setVisibleList && fontgenContext.setVisibleList( value as boolean );

				}}/>
			</div>
			<div className={style.btn}>
				<Button onClick={() => {

					fontgenContext.gl?.export();

				}}>JSON</Button>
			</div>
			<div className={style.btn}>
				<Button onClick={() => {

					fontgenContext.gl?.exportBase64();

				}}>Base64</Button>
			</div>
		</div>
	</div>;

};
