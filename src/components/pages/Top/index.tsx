import { Controls } from './Controls';
import style from './index.module.scss';
import { Setting } from './Setting';

import { GLCanvas } from '~/components/ui/GLCanvas';
import { Panel } from '~/components/ui/Parts/Panel';
import { PanelContainer } from '~/components/ui/Parts/PanelContainer';
import { GLContext, useGL } from '~/hooks/useGL';


export const TopPage = () => {

	const glContext = useGL();

	return <div className={style.top}>
		<PanelContainer >
			<Panel title="Fontgen" >
				<GLContext.Provider value={glContext}>
					<div className={style.inner}>
						<div className={style.controls}>
							<Setting />
						</div>
						<div className={style.canvas}>
							<GLCanvas />
						</div>
						<div className={style.controls}>
							<Controls fontPath={glContext.fontPath} />
						</div>
					</div>
				</GLContext.Provider>
			</Panel>
		</PanelContainer>
	</div>;

};
