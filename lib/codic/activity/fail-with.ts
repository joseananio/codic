export default async function failWith(
  message: string,
  time: number
): Promise<void> {
  this.failReason = message;
  this.failedAt = time || new Date().valueOf();
  await this.save();
}
