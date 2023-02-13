use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

static SOURCE_NAME: &str = "web";

// TODO: can we generate useful TypeScript typings for the returned type?
#[wasm_bindgen]
pub fn compile_js(input: String) -> JsValue {
    set_panic_hook();
    match try_compile_js(&input) {
        Ok((output, warnings)) => {
            let warnings: Vec<String> = warnings
                .into_iter()
                .map(|warning| {
                    render_diagnostic(
                        miette::Report::from(warning)
                            .with_source_code(miette::NamedSource::new(SOURCE_NAME, input.clone()))
                            .as_ref(),
                    )
                })
                .collect();

            let json = serde_json::json!({
                "output": output,
                "warnings": warnings,
            });
            serde_wasm_bindgen::to_value(&json).unwrap()
        }
        Err(err) => {
            let err = render_diagnostic(err.as_ref());
            let json = serde_json::json!({ "error": err });
            serde_wasm_bindgen::to_value(&json).unwrap()
        }
    }
}

#[wasm_bindgen]
pub fn fmt(input: String) -> JsValue {
    set_panic_hook();
    match try_fmt(&input) {
        Ok(output) => {
            let json = serde_json::json!({
                "output": output,
            });
            serde_wasm_bindgen::to_value(&json).unwrap()
        }
        Err(err) => {
            let err = render_diagnostic(err.as_ref());
            let json = serde_json::json!({ "error": err });
            serde_wasm_bindgen::to_value(&json).unwrap()
        }
    }
}

#[wasm_bindgen]
pub fn parse(input: String) -> JsValue {
    set_panic_hook();

    match ditto_cst::Module::parse(&input) {
        Ok(_) => {
            let json = serde_json::json!({});
            serde_wasm_bindgen::to_value(&json).unwrap()
        }
        Err(err) => {
            let err = render_diagnostic(&err.into_report(SOURCE_NAME, input.to_string()));
            let json = serde_json::json!({ "error": err });
            serde_wasm_bindgen::to_value(&json).unwrap()
        }
    }
}

type Warnings = Vec<ditto_checker::WarningReport>;

fn try_compile_js(input: &str) -> miette::Result<(String, Warnings)> {
    let cst = ditto_cst::Module::parse(&input)
        .map_err(|err| err.into_report(SOURCE_NAME, input.to_string()))?;

    let (ast, warnings) = ditto_checker::check_module(&ditto_checker::Everything::default(), cst)
        .map_err(|err| err.into_report(SOURCE_NAME, input.to_string()))?;

    let warnings = warnings
        .into_iter()
        .map(|warning| warning.into_report())
        .collect::<Vec<_>>();

    let js_config = &ditto_codegen_js::Config {
        foreign_module_path: "nah.js".to_string(),
        module_name_to_path: Box::new(move |(_package_name, _module_name)| unreachable!()),
    };
    let js = ditto_codegen_js::codegen(js_config, ast);

    Ok((js, warnings))
}

fn try_fmt(input: &str) -> miette::Result<String> {
    let cst = ditto_cst::Module::parse(&input)
        .map_err(|err| err.into_report(SOURCE_NAME, input.to_string()))?;

    let formatted = ditto_fmt::format_module(cst);

    Ok(formatted)
}

fn render_diagnostic(diagnostic: &dyn miette::Diagnostic) -> String {
    let mut rendered = String::new();
    miette::GraphicalReportHandler::new()
        .with_theme(miette::GraphicalTheme {
            // Need to be explicit about this, because the `Default::default()`
            // is impure and can vary between environments, which is no good for testing
            characters: miette::ThemeCharacters::unicode(),
            styles: miette::ThemeStyles::none(),
        })
        .with_context_lines(3)
        .render_report(&mut rendered, diagnostic)
        .unwrap();
    rendered
}

fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}
