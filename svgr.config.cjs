/** @type {import("@svgr/core").Config} */
module.exports = {
  plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
  filenameCase: 'kebab',
  jsxRuntime: 'automatic',
  typescript: true,
  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            cleanupEnableBackground: false,
            cleanupIds: false,
            removeViewBox: false,
            removeUnknownsAndDefaults: false,
          },
          prefixIds: {
            prefixIds: false,
          },
        },
      },
    ],
  },
}
