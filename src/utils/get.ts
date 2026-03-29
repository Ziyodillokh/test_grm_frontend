export function get(object: Record<string, string>, key: string) {
  if (key.indexOf(".") !== -1) {
    return get(
      // @ts-expect-error TODO: fix this
      object[key.split(".")[0]],
      key.split(".").slice(1).join(".")
    );
  }
  return object[key];
}
