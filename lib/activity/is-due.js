export default function isDue(at) {
  return this.nextRun - at <= 0;
}
