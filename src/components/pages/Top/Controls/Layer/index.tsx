import style from './index.module.scss';

type LayerProps = {
	index: number;
	path: number[];
};

export const Layer = ( props: LayerProps ) => {

	return <div className={style.layer}>
		{props.index}
	</div>;

};
