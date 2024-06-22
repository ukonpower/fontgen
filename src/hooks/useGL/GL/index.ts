import { PointerEventArgs } from 'ore-three';
import * as THREE from 'three';
import EventEmitter from 'wolfy87-eventemitter';

import { FontRenderer } from './FontRenderer';
import { Pointer } from './utils/Pointer';

export const CHARSET = `!"#&'()+,-./:=?@0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ`;

export type EditorSetting = {
	currentChar: string;
	pathList: {[key: string]: number[]};
}

export class GL extends EventEmitter {

	public canvas: HTMLCanvasElement;
	public context: CanvasRenderingContext2D;
	private canvasDisplaySize: THREE.Vector2;

	private fontRenderer: FontRenderer;
	private pointer: Pointer;

	private touching: boolean;

	public selectedPointIndex: number | null;

	public setting: EditorSetting;

	constructor() {

		super();

		this.canvas = document.createElement( 'canvas' );
		this.context = this.canvas.getContext( '2d' )!;

		this.canvas.width = 64 * 4;
		this.canvas.height = 100 * 4;

		this.canvasDisplaySize = new THREE.Vector2();

		this.touching = false;

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

		/*-------------------------------
			Setting
		-------------------------------*/

		const localDataStr = localStorage.getItem( 'fontEditorSetting' );

		if ( localDataStr ) {

			this.setting = JSON.parse( localDataStr );

		} else {

			this.setting = {
				currentChar: 'A',
				pathList: { "A": [
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
				] },
			};

		}

		this.selectedPointIndex = null;

		/*-------------------------------
			Render
		-------------------------------*/

		this.render();


	}

	public get currentPath() {

		const path = this.setting.pathList[ this.setting.currentChar ];

		if ( path ) return path;

		return this.setting.pathList[ this.setting.currentChar ] = [];

	}

	private onClick( e: MouseEvent ) {

		const canvasBound = this.canvas.getBoundingClientRect();

		const cursorPos = new THREE.Vector2( e.offsetX / canvasBound.width, e.offsetY / canvasBound.height );

		const p = this.currentPath;

		const nearPosIndex = p.reduce( ( prev, _, i, arr ) => {

			const x = arr[ i * 3 + 1 ];
			const y = arr[ i * 3 + 2 ];

			const dist = cursorPos.distanceTo( new THREE.Vector2( x, y ) );

			if ( dist < prev.dist ) {

				return { index: i, dist: dist };

			}

			return prev;

		}, { index: - 1, dist: Infinity } ).index;

		this.selectPoint( nearPosIndex == - 1 ? null : nearPosIndex );

	}

	private onPointerStart( e: PointerEventArgs ) {

		if ( this.touching ) return;

		this.touching = true;

		e.pointerEvent.preventDefault();

	}

	private onPointerMove( e: PointerEventArgs ) {

		if ( ! this.touching ) return;

		const delta = { x: e.delta.x * 1.0, y: e.delta.y * 1.0 };

		if ( this.selectedPointIndex !== null ) {

			this.currentPath[ this.selectedPointIndex * 3 + 1 ] += delta.x / this.canvasDisplaySize.x;
			this.currentPath[ this.selectedPointIndex * 3 + 2 ] += delta.y / this.canvasDisplaySize.y;

		}

		this.render();

		e.pointerEvent.preventDefault();

	}

	private onPointerEnd( e: PointerEventArgs ) {

		if ( ! this.touching ) return;

		this.updateSetting();

		this.touching = false;

		e.pointerEvent.preventDefault();

	}

	/*-------------------------------
		Point
	-------------------------------*/

	public get selectedPoint() {

		if ( this.currentPath.length == 0 ) return null;

		if ( this.selectedPointIndex === null ) return null;

		return this.currentPath.slice( this.selectedPointIndex * 3, this.selectedPointIndex * 3 + 3 );

	}

	public selectPoint( index: number | null ) {

		this.selectedPointIndex = index;

		this.render();

		this.emit( "update/point/select", this.selectedPointIndex );

	}

	public addPoint( index?: number, position?: number[] ) {

		const pos = position || [ 0.5, 0.5 ];

		if ( index !== undefined ) {

			this.currentPath.splice( index * 3, 0, 0, pos[ 0 ], pos[ 1 ] );

			this.selectPoint( index );

		} else {

			this.currentPath.push( 0, pos[ 0 ], pos[ 1 ] );

			this.selectPoint( this.currentPath.length / 3 - 1 );

		}

		this.updateSetting();

	}

	public deletePoint( index: number ) {

		this.currentPath.splice( index * 3, 3 );

		this.updateSetting( );

	}

	public setPointType( index: number, type: number ) {

		this.currentPath[ index * 3 ] = type;

		this.updateSetting( );

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

	/*-------------------------------
		Editor
	-------------------------------*/

	public setChar( char: string ) {

		this.setting.currentChar = char;
		this.selectPoint( null );
		this.updateSetting();

	}

	private updateSetting() {

		this.render();

		const keys = Object.keys( this.setting.pathList );

		keys.forEach( ( key ) => {

			this.setting.pathList[ key ] = this.setting.pathList[ key ].filter( ( v ) => v !== null );

		} );

		this.emit( "update/setting", { ...this.setting } );

		localStorage.setItem( 'fontEditorSetting', JSON.stringify( this.setting ) );

	}

	private render() {

		const drawPath = this.currentPath.concat();

		for ( let i = 0; i < drawPath.length / 3; i ++ ) {

			const pos = this.pointToGrid( [ drawPath[ i * 3 + 1 ], drawPath[ i * 3 + 2 ] ] );

			drawPath[ i * 3 + 1 ] = pos[ 0 ];
			drawPath[ i * 3 + 2 ] = pos[ 1 ];

		}

		this.fontRenderer.render( drawPath );

		const context = this.fontRenderer.context;

		// pointer

		if ( this.selectedPointIndex !== null ) {

			const x = this.currentPath[ this.selectedPointIndex * 3 + 1 ] * this.canvas.width;
			const y = this.currentPath[ this.selectedPointIndex * 3 + 2 ] * this.canvas.height;

			context.fillStyle = '#f50';
			context.beginPath();
			context.arc( x, y, this.canvas.width / 80, 0, Math.PI * 2 );
			context.closePath();
			context.fill();

		}

		// grid

		context.strokeStyle = '#555';
		context.lineWidth = 1;

		context.globalCompositeOperation = 'lighter';

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

	/*-------------------------------
		API
	-------------------------------*/

	public export() {

		let data = window.localStorage.getItem( 'fontEditorSetting' );

		if ( data ) {

			data = JSON.parse( data );

			const blob = new Blob( [ JSON.stringify( data ) ], { type: 'application/json' } );

			const url = URL.createObjectURL( blob );

			const a = document.createElement( 'a' );

			a.href = url;
			a.download = 'font.json';

			a.click();

		}

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
