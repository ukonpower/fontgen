import * as ORE from 'ore-three';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export class World extends THREE.Object3D {

	private gltf?: GLTF;

	private camera: THREE.Camera;
	private commonUniforms: ORE.Uniforms;

	private box: THREE.Mesh;

	constructor( camera: THREE.Camera, parentUniforms: ORE.Uniforms ) {

		super();

		this.camera = camera;

		this.commonUniforms = ORE.UniformsLib.mergeUniforms( parentUniforms, {
		} );

		/*-------------------------------
			Light
		-------------------------------*/

		const light = new THREE.SpotLight();
		light.lookAt( 0, 0, 0 );
		light.shadow.bias = - 0.001;
		light.castShadow = true;
		light.position.set( 1, 10, 1 );
		light.angle = Math.PI / 3;
		light.penumbra = 1;
		this.add( light );

		this.box = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshNormalMaterial() );
		this.add( this.box );

		this.camera.position.set( 0, 0, 5 );

	}

	public setGltf( gltf: GLTF ) {

		this.gltf = gltf;

		// this.add( this.gltf.scene );

	}

	public update( deltaTime: number ) {

		this.box.rotateY( deltaTime );
		this.box.rotateX( deltaTime * 0.1 );


	}

	public resize( info: ORE.LayerInfo ) {
	}

	public dispose() {
	}

}
