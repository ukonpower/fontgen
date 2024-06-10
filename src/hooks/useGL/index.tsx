import { createContext, useEffect, useState } from 'react';

import { GL } from './GL';

export type TGLContext = HooksContext<typeof useGL>;
export const GLContext = createContext<TGLContext>( {} );

export const useGL = () => {

	const [ gl, setGL ] = useState<GL>();

	useEffect( () => {

		const gl = new GL();
		setGL( gl );

		return () => {

			gl.dispose();
			setGL( undefined );

		};

	}, [] );

	return {
		gl
	};

};
