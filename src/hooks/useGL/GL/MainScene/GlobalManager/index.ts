import * as ORE from 'ore-three';

import { AssetManager } from './AssetManager';
import { EasyRaycaster } from './EasyRaycaster';


export class GlobalManager {

	public eRay: EasyRaycaster;
	public assetManager: AssetManager;
	public animator: ORE.Animator;

	constructor( ) {

		window.glCanvas.gManager = this;

		this.eRay = new EasyRaycaster();

		this.assetManager = new AssetManager();

		/*-------------------------------
			Animator
		-------------------------------*/

		this.animator = new ORE.Animator();

	}

	public update( deltaTime: number ) {

		this.animator.update( deltaTime );

	}

}

