import status from './activity-status';

export default function disable() {
	this.status = status.DISABLED;
	return this;
};