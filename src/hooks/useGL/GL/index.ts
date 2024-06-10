import * as ORE from 'ore-three';

import { MainScene } from './MainScene';
import { GlobalManager } from './MainScene/GlobalManager';
import { AssetManager } from './MainScene/GlobalManager/AssetManager';

declare global {
	interface Window {
		glCanvas: {
			gManager: GlobalManager;
			assetManager: AssetManager;
			isSP: boolean;
			mainScene: MainScene;
		}
	}
}

export class GL {

	public canvas: HTMLCanvasElement;

	public controller: ORE.Controller;
	public scene: MainScene;

	constructor() {

		window.glCanvas = {} as any;

		/*------------------------
			init ORE
		------------------------*/

		this.controller = new ORE.Controller();

		this.scene = new MainScene( {
			name: 'Main',
		} );

		this.canvas = this.scene.renderer.domElement;

		this.controller.addLayer( this.scene );

	}

	public setPointerElement( elm: HTMLElement ) {

		this.controller.setPointerEventElement( elm );

	}

	public dispose() {

		if ( this.controller ) {

			this.controller.dispose();

		}

	}

}
