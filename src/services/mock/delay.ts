export function wait(ms = 220) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
