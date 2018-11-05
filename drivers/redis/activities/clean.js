export default async function getActivitiesRaw() {
  return await this.db.del(this.keyBase + ":activity");
}
