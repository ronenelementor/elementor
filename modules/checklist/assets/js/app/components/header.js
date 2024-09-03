import { Typography, CloseButton, AppBar, Divider, Toolbar } from '@elementor/ui';
import { __ } from '@wordpress/i18n';
import Progress from './progress';
import PropTypes from 'prop-types';
import { useQuery } from '@elementor/query';
import * as React from 'react';
import { toggleChecklistPopup } from '../../utils/functions';
import { USER_PROGRESS } from '../../utils/consts';

const { FIRST_CLOSED_CHECKLIST_IN_EDITOR } = USER_PROGRESS;

const fetchStatus = async () => {
	const response = await $e.data.get( 'checklist/user-progress', {}, { refresh: true } );

	return response?.data?.data?.[ FIRST_CLOSED_CHECKLIST_IN_EDITOR ] || false;
};

const Header = ( { steps } ) => {
	const { data: closedForFirstTime } = useQuery( {
		queryKey: [ 'closedForFirstTime' ],
		queryFn: fetchStatus,
	} );

	const closeChecklist = async () => {
		if ( ! closedForFirstTime ) {
			await $e.data.update( 'checklist/user-progress', {
				[ FIRST_CLOSED_CHECKLIST_IN_EDITOR ]: true,
			} );

			window.dispatchEvent( new CustomEvent( 'elementor/checklist/first_close', { detail: { message: 'firstClose' } } ) );
		}

		toggleChecklistPopup();
	};

	return (
		<>
			<AppBar
				elevation={ 0 }
				position="sticky"
				color="transparent"
				sx={ { p: 2 } }
			>
				<Toolbar
					variant="dense"
					disableGutters={ true }
				>
					<Typography
						variant="subtitle1"
						sx={ { flexGrow: 1 } }
					>
						{ __( 'Let\'s make a productivity boost', 'elementor' ) }
					</Typography>
					<CloseButton onClick={ closeChecklist } />
				</Toolbar>
				<Progress steps={ steps } />
			</AppBar>
			<Divider />
		</>
	);
};

Header.propTypes = {
	steps: PropTypes.array.isRequired,
};

export default Header;

