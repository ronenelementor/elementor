import { type Props } from '@elementor/editor-props';
import { type CustomCss } from '@elementor/editor-styles';
import { __privateRunCommandSync as runCommandSync } from '@elementor/editor-v1-adapters';

import { type ElementID } from '../types';
import { getContainer } from './get-container';

export type UpdateElementSettingsArgs = {
	id: ElementID;
	props: Props;
	customCss?: CustomCss | null;
	withHistory?: boolean;
};

export const updateElementSettings = ( { id, props, withHistory = true, ...args }: UpdateElementSettingsArgs ) => {
	const container = getContainer( id );

	const settings =
		'customCss' in args
			? {
					container,
					settings: { ...props },
					customCss: args.customCss ?? null,
			  }
			: {
					container,
					settings: { ...props },
			  };

	if ( withHistory ) {
		runCommandSync( 'document/elements/settings', settings );
	} else {
		runCommandSync( 'document/elements/set-settings', settings, { internal: true } );
	}
};
