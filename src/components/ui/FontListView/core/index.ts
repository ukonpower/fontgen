import { CHARSET, EditorSetting, pointToGrid } from "../../Fontgen/useFontgen/FontgenCore";
import { FontRenderer } from "../../Fontgen/useFontgen/FontgenCore/FontRenderer";

const column = 8;

export class FontListViewCore {

	public canvas: HTMLCanvasElement;
	public context: CanvasRenderingContext2D;
	public renderer: FontRenderer;

	private charCanvas: HTMLCanvasElement;
	private charContext: CanvasRenderingContext2D;

	constructor() {

		this.charCanvas = document.createElement( "canvas" );
		this.charContext = this.charCanvas.getContext( "2d"	)!;
		this.charCanvas.width = 64;
		this.charCanvas.height = 100;

		this.canvas = document.createElement( "canvas" );
		this.context = this.canvas.getContext( "2d"	)!;
		this.canvas.width = this.charCanvas.width * column;
		this.canvas.height = this.charCanvas.height * Math.ceil( CHARSET.length / column );

		this.renderer = new FontRenderer();

	}

	public render() {

		const data = window.localStorage.getItem( 'fontEditorSetting' );

		if ( ! data ) return;

		const setting = JSON.parse( data ) as EditorSetting;

		this.charContext.clearRect( 0, 0, this.charCanvas.width, this.charCanvas.height );

		const row = Math.ceil( CHARSET.length / column );

		for ( let i = 0; i < row; i ++ ) {

			for ( let j = 0; j < column; j ++ ) {

				const char = CHARSET[ i * column + j ];

				if ( char === undefined ) break;

				const path = setting.pathList[ char ].concat();

				for ( let k = 0; k < path.length / 3; k ++ ) {

					const pos = pointToGrid( [ path[ k * 3 + 1 ], path[ k * 3 + 2 ] ] );
					path[ k * 3 + 1 ] = pos[ 0 ];
					path[ k * 3 + 2 ] = pos[ 1 ];

				}

				this.renderer.render( this.charContext, path );

				this.context.drawImage( this.charCanvas, j * this.charCanvas.width, i * this.charCanvas.height );

			}

		}

	}

	public dispose() {

		this.canvas.remove();

	}

}
