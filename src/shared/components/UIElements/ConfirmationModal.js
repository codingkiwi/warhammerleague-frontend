import React from 'react';

import Modal from './Modal';
import Button from '../FormElements/Button';

const ConfirmationModal = (props) => {
	return (
		<Modal
			onCancel={props.onClear}
			onSubmit={props.onSubmit}
			header='Are You Sure?'
			show={!!props.confirmation}
			footer={
				<React.Fragment>
					<Button onClick={props.onSubmit}>Proceed</Button>
					<Button onCancel={props.onCancel}>Cancel</Button>
				</React.Fragment>
			}
		>
			<p>{props.confirmation}</p>
		</Modal>
	);
};

export default ConfirmationModal;
