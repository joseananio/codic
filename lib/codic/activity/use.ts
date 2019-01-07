export default function use(data: any) {
  this.attrs = { ...this.attrs, data };
  return this;
}
