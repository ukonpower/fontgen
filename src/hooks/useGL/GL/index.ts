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

		this.canvas.width = 64;
		this.canvas.height = 100;

		this.canvasDisplaySize = new THREE.Vector2();

		this.touching = false;

		this.fontPath = [
			0, 0.5, 0.5,
			0, 0.5, 0.5,
			0, 0.5, 0.5,
			0, 0.5, 0.5
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

		this.pointer.on( "move", onPointerMove );
		this.pointer.on( "start", onPointerStart );
		this.pointer.on( "end", onPointerEnd );

		this.once( "dispose", () => {

			this.pointer.off( "move", onPointerMove );
			this.pointer.off( "start", onPointerStart );
			this.pointer.off( "end", onPointerEnd );

		} );

	}

	private onPointerStart( e: PointerEventArgs ) {

		if ( this.touching ) return;

		this.touching = true;

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

		this.touching = false;

	}

	public selectPoint( index: number ) {

		this.selectedPointIndex = index;

		this.render();

		this.emit( "update/point/select", this.selectedPointIndex );

	}

	public addPoint( index?: number ) {

		if ( index !== undefined ) {

			this.fontPath.splice( index * 3, 0, 0, 0.5, 0.5 );

			this.selectPoint( index );

		} else {

			this.fontPath.push( 0, 0.5, 0.5 );

			this.selectPoint( this.fontPath.length / 3 - 1 );

		}

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

	private render() {

		this.fontRenderer.render( this.fontPath );

		const context = this.fontRenderer.context;

		const x = this.fontPath[ this.selectedPointIndex * 3 + 1 ] * this.canvas.width;
		const y = this.fontPath[ this.selectedPointIndex * 3 + 2 ] * this.canvas.height;

		context.fillStyle = '#f50';
		context.beginPath();
		context.arc( x, y, 2, 0, Math.PI * 2 );
		context.closePath();
		context.fill();


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
