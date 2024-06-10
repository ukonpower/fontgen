import * as THREE from 'three';

export class GL extends THREE.EventDispatcher<any> {

	public canvas: HTMLCanvasElement;
	public context: CanvasRenderingContext2D;

	constructor() {

		super();

		this.canvas = document.createElement( 'canvas' );
		this.context = this.canvas.getContext( '2d' )!;

		this.canvas.width = 64;
		this.canvas.height = 100;

		const onResize = this.resize.bind( this );

		window.addEventListener( 'resize', onResize );

		const onDispose = () => {

			window.removeEventListener( 'resize', onResize );

			this.removeEventListener( 'dispose', onDispose );

		};

		this.addEventListener( 'dispose', onDispose );


		setTimeout( () => {

			this.resize();

		}, 100 );

	}

	public resize() {

		const parent = this.canvas.parentElement;

		if ( parent ) {

			const bound = parent.getBoundingClientRect();

			let width = bound.width;
			let height = bound.height;

			const aspect = width / height;

			console.log( this.canvas.width / this.canvas.height );


			if ( aspect < this.canvas.width / this.canvas.height ) {

				height = width / aspect;

			} else {

				width = height * aspect;

			}

			this.canvas.style.width = width + "px";
			this.canvas.style.height = height + "px";

		}

	}


	public dispose() {

		this.dispatchEvent( { type: 'dispose' } );

	}

}
