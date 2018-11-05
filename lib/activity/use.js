export default function use(data) {
  this.attrs = { ...this.attrs, data };
  return this;
}
