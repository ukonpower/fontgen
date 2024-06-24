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

	private grid: [number, number];
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
		this.grid = [ 8, 8 ];

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
				pathList: {}
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

		const newPos = [];

		const x = pos[ 0 ];
		const y = pos[ 1 ];

		const gridX = this.grid[ 0 ];
		const gridY = this.grid[ 1 ];

		newPos[ 0 ] = Math.floor( x * gridX + 0.5 ) / gridX;
		newPos[ 1 ] = Math.floor( y * gridY + 0.5 ) / gridY;

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

		for ( let i = 1; i < this.grid[ 0 ]; i ++ ) {

			const x = this.canvas.width / this.grid[ 0 ] * i;

			context.beginPath();
			context.moveTo( x, 0 );
			context.lineTo( x, this.canvas.height );
			context.stroke();

		}

		for ( let i = 1; i < this.grid[ 1 ]; i ++ ) {

			const y = this.canvas.height / this.grid[ 1 ] * i;

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

	public exportBase64() {

		const data = window.localStorage.getItem( 'fontEditorSetting' );

		if ( data ) {

			const setting = JSON.parse( data ) as EditorSetting;

			const pathKeys = Object.keys( setting.pathList );

			const base64Encode = ( uint8Array: Uint8Array ) => {

				let binaryString = '';
				for ( let i = 0; i < uint8Array.length; i ++ ) {

					binaryString += String.fromCharCode( uint8Array[ i ] );

				}

				return btoa( binaryString );

			};

			const resShape: string[] = [];
			const resType: string[] = [];

			console.log( pathKeys );

			pathKeys.forEach( ( key ) => {

				const pathList = setting.pathList[ key ];

				const shapeArray = [ pathList.length / 3 ];
				const typeArray = [];

				for ( let i = 0; i < pathList.length; i += 3 ) {

					typeArray.push( pathList[ i ] );

					const gridPos = this.pointToGrid( [ pathList[ i + 1 ], pathList[ i + 2 ] ] );

					const x = gridPos[ 0 ] * this.grid[ 0 ] - 1;
					const y = gridPos[ 1 ] * this.grid[ 1 ] - 1;

					const girdIndex = y * ( this.grid[ 0 ] - 1 ) + x;

					shapeArray.push( girdIndex );

				}

				// type

				const typeBinaryString = typeArray.map( num => num.toString( 2 ).padStart( 3, '0' ) ).join( '' );

				const typeByteArray = [];

				for ( let i = 0; i < typeBinaryString.length; i += 8 ) {

					const byte = ( typeBinaryString.slice( i, i + 8 ) + "00000000" ).slice( 0, 8 );

					typeByteArray.push( parseInt( byte, 2 ) );

				}

				resType.push( base64Encode( new Uint8Array( typeByteArray ) ) );

				// shape

				const shapeBinaryString = shapeArray.map( num => num.toString( 2 ).padStart( 6, '0' ) ).join( '' );

				const shapeByteArray = [];

				for ( let i = 0; i < shapeBinaryString.length; i += 8 ) {

					const byte = ( shapeBinaryString.slice( i, i + 8 ) + "00000000" ).slice( 0, 8 );


					shapeByteArray.push( parseInt( byte, 2 ) );

				}

				resShape.push( base64Encode( new Uint8Array( shapeByteArray ) ) );

			} );

			const type = resType.join( "," );
			const shape = resShape.join( "," );

			const resData = {
				pointType: type,
				pointPos: shape,
				charset: pathKeys.join( '' ),
				grid: this.grid
			};

			const blob = new Blob( [ JSON.stringify( resData ) ], { type: 'application/json' } );

			const url = URL.createObjectURL( blob );

			const a = document.createElement( 'a' );

			a.href = url;
			a.download = 'font-base64.json';

			a.click();

			console.log( resData );

			// this.decode( type, shape );

		}

	}

	private decode( type: string, shape: string ) {

		const typeArray = type.split( ',' );
		const shapeArray = shape.split( ',' );

		const base64Decode = ( base64String: string ) => {

			const binaryString = atob( base64String );

			const uint8Array = new Uint8Array( binaryString.length );

			for ( let i = 0; i < binaryString.length; i ++ ) {

				uint8Array[ i ] = binaryString.charCodeAt( i );

			}

			return uint8Array;

		};

		const decodeArray = ( uint8Array: Uint8Array, bit: number ) => {

			let binaryString = '';

			uint8Array.forEach( byte => {

				binaryString += byte.toString( 2 ).padStart( 8, '0' );

			} );

			const array = [];

			for ( let i = 0; i < binaryString.length; i += bit ) {

				array.push( parseInt( binaryString.slice( i, i + bit ), 2 ) );

			}

			return array;

		};

		const out: number[][] = [];

		for ( let i = 0; i < typeArray.length; i ++ ) {


			const type = typeArray[ i ];
			const resType = decodeArray( base64Decode( type ), 3 );

			const shape = shapeArray[ i ];
			const resShape = decodeArray( base64Decode( shape ), 6 );

			const pathLength = resShape.shift() || 0;

			const res = [];

			for ( let i = 0; i < pathLength; i ++ ) {

				res.push(
					resType[ i ],
					( resShape[ i ] % ( this.grid[ 0 ] - 1 ) + 1 ) / ( this.grid[ 0 ] ),
					( Math.floor( resShape[ i ] / ( this.grid[ 0 ] - 1 ) ) + 1 ) / ( this.grid[ 1 ] )
				);

			}

			out.push( res );

		}

		console.log( out );

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
