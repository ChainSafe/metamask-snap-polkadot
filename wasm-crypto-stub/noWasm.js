export function isReady () {
  // always false, when true it will try and use non-existent functions
  return false;
}

export function waitReady () {
  // always immediate true, our process is done
  return Promise.resolve(true);
}