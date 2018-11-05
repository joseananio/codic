export default async function save() {
  await this.driver.saveActivity(this);
  return this;
}
