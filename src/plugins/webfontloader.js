/**
 * plugins/webfontloader.js
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */

export async function loadFonts() {
  const webFontLoader = await import(
    /* webpackChunkName: "webfontloader" */ "webfontloader"
  );

  // TODO: can't load multiple fonts
  webFontLoader.load({
    google: {
      families: [
        "Roboto:100,300,400,500,700,900&display=swap",
        // "Vibur:100,300,400,500,700,900&display=swap",
      ],
    },
  });
}
