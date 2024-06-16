import { i } from 'node_modules/vite/dist/node/types.d-aGj9QkWt';
import { PointerEventArgs } from 'ore-three';
import * as THREE from 'three';
import EventEmitter from 'wolfy87-eventemitter';

import { FontRenderer } from './FontRenderer';
import { Pointer } from './utils/Pointer';

export class GL extends EventEmitter {

	public canvas: HTMLCanvasElement;
	public context: CanvasRenderingContext2D;
	private canvasDisplaySize: THREE.Vector2;

	private fontRenderer: FontRenderer;
	private pointer: Pointer;

	private touching: boolean;

	public fontPath: number[];
	public selectedPointIndex: number;

	constructor() {

		super();

		this.canvas = document.createElement( 'canvas' );
		this.context = this.canvas.getContext( '2d' )!;

		this.canvas.width = 64 * 4;
		this.canvas.height = 100 * 4;

		this.canvasDisplaySize = new THREE.Vector2();

		this.touching = false;

		this.fontPath = [
			3,
			0.18277079910441507,
			0.8894120367839901,
			0,
			0.5390035878349174,
			0.1438712152823456,
			1,
			0.8562325903479937,
			0.8844192728255876,
			3,
			0.3751883403840053,
			0.5399394454063108,
			1,
			0.6924174420883358,
			0.5399394454063108
		];
		this.selectedPointIndex = 0;

		/*-------------------------------
			Resize
		-------------------------------*/

		const onResize = this.resize.bind( this );

		window.addEventListener( 'resize', onResize );

		const onDispose = () => {

			window.removeEventListener( 'resize', onResize );

			this.off( 'dispose', onDispose );

		};

		this.on( 'dispose', onDispose );

		setTimeout( () => {

			this.resize();

		}, 100 );

		/*-------------------------------
			Renderer
		-------------------------------*/

		this.fontRenderer = new FontRenderer( this.canvas, this.context );
		this.render();

		/*-------------------------------
			Pointer
		-------------------------------*/

		this.pointer = new Pointer();

		this.pointer.setElement( this.canvas );

		const onPointerStart = this.onPointerStart.bind( this );
		const onPointerMove = this.onPointerMove.bind( this );
		const onPointerEnd = this.onPointerEnd.bind( this );
		const onClick = this.onClick.bind( this );

		this.pointer.on( "move", onPointerMove );
		this.pointer.on( "start", onPointerStart );
		this.pointer.on( "end", onPointerEnd );
		this.canvas.addEventListener( 'click', onClick );

		this.once( "dispose", () => {

			this.pointer.off( "move", onPointerMove );
			this.pointer.off( "start", onPointerStart );
			this.pointer.off( "end", onPointerEnd );
			this.canvas.removeEventListener( 'click', onClick );

		} );

	}

	private onClick( e: MouseEvent ) {

		const canvasBound = this.canvas.getBoundingClientRect();

		const cursorPos = new THREE.Vector2( e.offsetX / canvasBound.width, e.offsetY / canvasBound.height );

		const nearPosIndex = this.fontPath.reduce( ( prev, _, i, arr ) => {

			const x = arr[ i * 3 + 1 ];
			const y = arr[ i * 3 + 2 ];

			const dist = cursorPos.distanceTo( new THREE.Vector2( x, y ) );

			if ( dist < prev.dist ) {

				return { index: i, dist: dist };

			}

			return prev;

		}, { index: - 1, dist: Infinity } ).index;

		this.selectPoint( nearPosIndex );

	}

	private onPointerStart( e: PointerEventArgs ) {

		if ( this.touching ) return;

		this.touching = true;

		e.pointerEvent.preventDefault();

	}

	private onPointerMove( e: PointerEventArgs ) {

		if ( ! this.touching ) return;

		const delta = { x: e.delta.x * 1.0, y: e.delta.y * 1.0 };

		this.fontPath[ this.selectedPointIndex * 3 + 1 ] += delta.x / this.canvasDisplaySize.x;
		this.fontPath[ this.selectedPointIndex * 3 + 2 ] += delta.y / this.canvasDisplaySize.y;

		this.render();

		e.pointerEvent.preventDefault();

	}

	private onPointerEnd( e: PointerEventArgs ) {

		if ( ! this.touching ) return;

		this.emit( "update/path", this.fontPath.concat() );

		this.touching = false;

		e.pointerEvent.preventDefault();

	}

	public selectPoint( index: number ) {

		this.selectedPointIndex = index;

		this.render();

		this.emit( "update/point/select", this.selectedPointIndex );

	}

	public addPoint( index?: number, position?: number[] ) {

		const pos = position || [ 0.5, 0.5 ];

		if ( index !== undefined ) {

			this.fontPath.splice( index * 3, 0, 0, pos[ 0 ], pos[ 1 ] );

			this.selectPoint( index );

		} else {

			this.fontPath.push( 0, pos[ 0 ], pos[ 1 ] );

			this.selectPoint( this.fontPath.length / 3 - 1 );

		}

		console.log( this.fontPath );


		this.setPath( this.fontPath );

	}

	public deletePoint( index: number ) {

		this.fontPath.splice( index * 3, 3 );

		this.setPath( this.fontPath );

	}

	public setPointType( index: number, type: number ) {

		this.fontPath[ index * 3 ] = type;

		this.setPath( this.fontPath );

	}

	public setPath( fontPath: number[] ) {

		this.fontPath = fontPath;

		this.render();

		this.emit( "update/path", this.fontPath.concat() );

	}

	private pointToGrid( pos: number[] ) {

		const newPos = pos.concat();

		const x = pos[ 0 ];
		const y = pos[ 1 ];

		const res = 8.0;

		newPos[ 0 ] = Math.floor( x * res + 0.5 ) / res;
		newPos[ 1 ] = Math.floor( y * res + 0.5 ) / res;

		return newPos;

	}

	private render() {

		const drawPath = this.fontPath.concat();

		for ( let i = 0; i < drawPath.length / 3; i ++ ) {

			const pos = this.pointToGrid( [ drawPath[ i * 3 + 1 ], drawPath[ i * 3 + 2 ] ] );

			drawPath[ i * 3 + 1 ] = pos[ 0 ];
			drawPath[ i * 3 + 2 ] = pos[ 1 ];

		}

		this.fontRenderer.render( drawPath );

		const context = this.fontRenderer.context;

		const x = this.fontPath[ this.selectedPointIndex * 3 + 1 ] * this.canvas.width;
		const y = this.fontPath[ this.selectedPointIndex * 3 + 2 ] * this.canvas.height;

		// pointer

		context.fillStyle = '#f50';
		context.beginPath();
		context.arc( x, y, 2, 0, Math.PI * 2 );
		context.closePath();
		context.fill();

		// grid

		context.strokeStyle = '#555';
		context.lineWidth = 1;

		context.globalCompositeOperation = 'lighter';

		const res = 8;

		for ( let i = 1; i < 8; i ++ ) {

			const x = this.canvas.width / 8 * i;

			context.beginPath();
			context.moveTo( x, 0 );
			context.lineTo( x, this.canvas.height );
			context.stroke();

		}

		for ( let i = 1; i < 8; i ++ ) {

			const y = this.canvas.height / 8 * i;

			context.beginPath();
			context.moveTo( 0, y );
			context.lineTo( this.canvas.width, y );
			context.stroke();

		}

		context.globalCompositeOperation = 'source-over';

	}

	public resize() {

		const parent = this.canvas.parentElement;

		if ( parent ) {

			const bound = parent.getBoundingClientRect();

			let width = bound.width;
			let height = bound.height;

			const bountAspect = width / height;
			const canvasAspect = this.canvas.width / this.canvas.height;

			if ( bountAspect < canvasAspect ) {

				height = width / canvasAspect;

			} else {

				width = height * canvasAspect;

			}

			this.canvas.style.width = width + "px";
			this.canvas.style.height = height + "px";

			this.canvasDisplaySize.set( width, height );

		}

	}

	public dispose() {

		this.emitEvent( 'dispose' );

	}

}
