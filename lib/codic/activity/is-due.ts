export default function isDue(at: Date) {
  return this.nextRun - new Date(at).valueOf() <= 0;
}
