import status from './activity-status';

export default function disable() {
	this.status = status.ACTIVE;
	return this;
};