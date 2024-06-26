

import style from './index.module.scss';

import { IconCheck } from '~/components/ui/Icon/IconCheck';

type InputBooleanProps = {
	checked?: boolean
	onChange?: ( checked: boolean ) => void
	disable?: boolean
	readOnly?: boolean
};

export const InputBoolean = ( { onChange, ...props }: InputBooleanProps ) => {

	return <div className={style.inputBoolean} onClick={( e ) => {

		e.stopPropagation();

	}}>
		<label>
			<input className={style.input} type="checkbox" checked={props.checked} disabled={props.disable} readOnly={props.readOnly}
				onChange={( e ) => {

					if ( props.readOnly ) return;

					onChange && onChange( e.target.checked );

				}}
			/>
			<div className={style.check} data-read_only={props.readOnly}>
				{props.checked && <IconCheck />}
			</div>
		</label>
	</div>;

};
