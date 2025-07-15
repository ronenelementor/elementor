import { mergeProps } from '@elementor/editor-props';
import { getVariantByMeta, type StyleDefinition, type StyleDefinitionVariant } from '@elementor/editor-styles';

import { StyleNotFoundError } from '../errors';
import { type ElementID } from '../types';
import { mutateElementStyles } from './mutate-element-styles';

export type UpdateElementStyleArgs = {
	elementId: ElementID;
	styleId: StyleDefinition[ 'id' ];
	meta: StyleDefinitionVariant[ 'meta' ];
	props: StyleDefinitionVariant[ 'props' ];
	customCss?: StyleDefinitionVariant[ 'customCss' ];
};

export function updateElementStyle( args: UpdateElementStyleArgs ) {
	mutateElementStyles( args.elementId, ( styles ) => {
		const style = styles[ args.styleId ];

		if ( ! style ) {
			throw new StyleNotFoundError( { context: { styleId: args.styleId } } );
		}

		const variant = getVariantByMeta( style, args.meta );
		const newCustomCss = 'customCss' in args ? args.customCss ?? null : variant?.customCss ?? null;

		if ( variant ) {
			variant.props = mergeProps( variant.props, args.props );
			variant.customCss = newCustomCss;
		} else {
			style.variants.push( { meta: args.meta, props: args.props, customCss: newCustomCss } );
		}

		return styles;
	} );
}
