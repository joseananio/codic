const defaultProps = {
  priority: 1,
  status: 1
};
export function copyConfig(to, from) {
  if (from.priority) to.priority = from.priority;
  return to;
}

export function Task(name, config, definition) {
  copyConfig(this, { ...defaultProps, ...config });
  this.name = name;
  this.definition = definition;
}
