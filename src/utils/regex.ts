/* eslint-disable no-useless-escape */

export const onlyStringAndNumbers = (str: string) => {
  return str.replaceAll(/[^A-Z0-9_-]/gi, '');
};

export const emailIsValid = (str: string) => {
  return str.match(
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  );
};

/**
 * Constructs a dynamic regular expression for pattern matching in text.
 *
 * @param {string} opening - Opening character for the search pattern. eg : '{{'.
 * @param {string} [closing] - Optional closing character for the search pattern. If not provided, the regular expression will match text from the opening character to the end of the text, eg: '}}'.
 * @returns {RegExp} - A dynamically constructed regular expression based on the provided opening and closing characters.
 */
export const buildDynamicRegex = (opening: string, closing?: string): RegExp => {
  if (!closing) {
    return new RegExp(`${opening}([^]*)`);
  }

  // Escapes the opening and closing characters if provided.
  const escapedOpening = opening.replace(/[-/^$*+?.()|[\]{}]/g, '\\$&');
  const escapedClosing = closing.replace(/[-/^$*+?.()|[\]{}]/g, '\\$&');

  const regexPattern = new RegExp(
    `${escapedOpening}\\s*([^${escapedClosing}]*?)\\s*${escapedClosing}`,
  );

  return regexPattern;
};
