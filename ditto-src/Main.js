export const CODE_QUERY_PARAM = "code-base64";

export function save_code_query_impl(code) {
  return () => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(CODE_QUERY_PARAM, window.btoa(code));
    let url = `${window.location.origin}${window.location.pathname}?${urlParams}`;
    window.history.replaceState({}, "", url);
  };
}
