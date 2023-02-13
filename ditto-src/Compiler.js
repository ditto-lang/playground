import init from "ditto-web";

/**
 * @param {(compiler: Compiler) => () => void} handle_success
 * @param {(error: unknown) => () => void} handle_error
 * @returns {() => void}
 */
export function init_impl(handle_success, handle_error) {
  return () => {
    init()
      .then((wasm) => {
        /** @type {Compiler["greet"]} */
        const greet = (_message) => () => wasm.greet();

        handle_success({ greet })();
      })
      .catch((err) => {
        console.log("oops", err);
        handle_error(err)();
      });
  };
}

/**
 * @typedef {Object} Compiler
 * @property {(message: string) => () => void} greet
 */
