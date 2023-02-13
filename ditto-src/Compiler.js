import init, * as wasm from "ditto-web";

/**
 * @param {(compiler: any) => () => void} handle_success
 * @param {(error: unknown) => () => void} handle_error
 * @param {(a: any) => any} Ok
 * @param {(b: any) => any} Err
 * @param {any} unit
 * @returns {() => void}
 */
export function init_impl(handle_success, handle_error, Ok, Err, unit) {
  return () => {
    init()
      .then((_wasm) => {
        const compile_js = (/** @type {string} */ input) => {
          const result = wasm.compile_js(input);
          if (result.has("error")) {
            return Err(result.get("error"));
          }
          return Ok({
            js: result.get("output"),
            warnings: result.get("warnings"),
          });
        };

        const fmt = (/** @type {string} */ input) => {
          const result = wasm.fmt(input);
          if (result.has("error")) {
            return Err(result.get("error"));
          }
          return Ok(result.get("output"));
        };

        const parse = (/** @type {string} */ input) => {
          const result = wasm.fmt(input);
          if (result.has("error")) {
            return Err(result.get("error"));
          }
          return Ok(unit);
        };

        handle_success({ compile_js, fmt, parse })();
      })
      .catch((err) => {
        handle_error(err)();
      });
  };
}
