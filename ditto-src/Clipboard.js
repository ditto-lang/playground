/**
 * @param {() => void} done_callback
 * @param {(err: unknown) => () => void} err_callback
 * @returns {() => void}
 */
export function copy_url_impl(done_callback, err_callback) {
  return () => {
    navigator.clipboard
      .writeText(window.location.toString())
      .then(() => {
        done_callback();
      })
      .catch((err) => {
        err_callback(err)();
      });
  };
}
