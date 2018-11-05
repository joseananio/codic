import status from './activity-status';

export default function isActive() {
	return this.status===status.ACTIVE;
};