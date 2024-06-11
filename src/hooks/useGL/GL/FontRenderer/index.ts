import { context } from "three/examples/jsm/nodes/Nodes.js";

export class FontRenderer {

	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;

	constructor( canvas: HTMLCanvasElement, context: CanvasRenderingContext2D ) {

		this.canvas = canvas;
		this.context = context;


	}

	public render( fontPath: number[] ) {

		// this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
		this.context.fillStyle = '#000';
		this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );

		const width = this.canvas.width;
		const height = this.canvas.height;

		this.context.fillStyle = '#fff';
		this.context.strokeStyle = '#fff';
		this.context.lineWidth = 4;

		this.context.beginPath();

		this.context.moveTo( fontPath[ 1 ] * width, fontPath[ 2 ] * height );

		for ( let i = 0; i < fontPath.length / 3; i ++ ) {

			const path = fontPath.slice( i * 3, i * 3 + 3 );

			const type = path[ 0 ];
			const x = path[ 1 ] * width;
			const y = path[ 2 ] * height;

			this.context.lineTo( x, y );

		}

		this.context.closePath();
		this.context.stroke();

	}

}
