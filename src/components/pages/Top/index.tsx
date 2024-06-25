import { useState } from 'react';

import { Controls } from './Controls';
import style from './index.module.scss';
import { Setting } from './Setting';

import { GLCanvas } from '~/components/ui/Fontgen';
import { FontgenContext, useFontgen } from '~/components/ui/Fontgen/useFontgen';
import { FontListView } from '~/components/ui/FontListView';
import { Panel } from '~/components/ui/Parts/Panel';
import { PanelContainer } from '~/components/ui/Parts/PanelContainer';


export const TopPage = () => {

	const fontgenContext = useFontgen();


	return <div className={style.top}>
		<PanelContainer >
			<Panel title="Fontgen" noPadding>
				<FontgenContext.Provider value={fontgenContext}>
					<div className={style.inner}>
						<div className={style.controls}>
							<Setting />
						</div>
						<div className={style.canvas}>
							<GLCanvas />
							<div className={style.list}>
								<FontListView />
							</div>
						</div>
						<div className={style.controls}>
							<Controls />
						</div>
					</div>
				</FontgenContext.Provider>
			</Panel>
		</PanelContainer>
	</div>;

};
