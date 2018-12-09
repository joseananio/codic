export default function use(data: object) {
  this.attrs = { ...this.attrs, data };
  return this;
}
