import init, * as wasm from "ditto-web";
import prettier from "prettier/standalone";
import prettierParserBabel from "prettier/parser-babel";

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
            js: format_js(
              result
                .get("output")
                // add some empty lines
                .replace(/(\n)/g, "$1$1")
            ),
            warnings: result.get("warnings"),
          });
        };

        const fmt = (/** @type {string} */ input) => {
          const result = wasm.fmt(input);
          if (result.has("error")) {
            return Err(result.get("error"));
          }
          const edits = result.get("output").map((edit) => ({
            from: edit.get("from"),
            to: edit.get("to"),
            insert: edit.get("insert"),
          }));
          return Ok(edits);
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

function format_js(code) {
  return prettier.format(code, {
    filepath: "output.js",
    plugins: [prettierParserBabel],
  });
}
