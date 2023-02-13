export function log_impl(message) {
  return () => {
    console.log(message);
  };
}
