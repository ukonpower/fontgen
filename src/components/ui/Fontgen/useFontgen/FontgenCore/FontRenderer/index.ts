
export const PointTypeList = [ 'None', 'End', 'Close', "Line", "Fill" ];

export class FontRenderer {

	public canvas: HTMLCanvasElement;
	public context: CanvasRenderingContext2D;

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

		let currentType = - 1;

		for ( let i = 0; i < fontPath.length / 3; i ++ ) {

			const ci = i * 3;
			const pi = ( i - 1 ) * 3;

			const path = fontPath.slice( ci, ci + 3 );
			const prevPath = fontPath.slice( pi, pi + 3 );

			const x = path[ 1 ] * width;
			const y = path[ 2 ] * height;

			const pathType = path[ 0 ];
			const prevPathType = prevPath[ 0 ];

			if ( pathType == 0 ) {

				// none

				this.context.lineTo( x, y );

			} else if ( pathType == 3 || pathType == 4 ) {

				// line

				this.context.beginPath();
				this.context.moveTo( x, y );

				currentType = pathType;

			} else if ( pathType == 1 || pathType == 2 ) {

				// close

				this.context.lineTo( x, y );

				if ( pathType == 2 ) {

					this.context.closePath();

				}

				if ( currentType == 3 ) {

					this.context.stroke();

				} else if ( currentType == 4 ) {

					this.context.fill();

				}

				currentType = - 1;

			}

		}

		this.context.closePath();

	}

}
