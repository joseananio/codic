import { ActivityStatus } from "./enums";

export default function isActive() {
  return this.status === ActivityStatus.ACTIVE;
}
