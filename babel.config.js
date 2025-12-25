// // babel.config.js
// module.exports = function (api) {
//   api.cache(true)
//   return {
//     presets:[
//       ["babel-preset-expo", { jsxImportSource: "nativewind" }],
//       "nativewind/babel", // Move this here from plugins
//     ],
//     plugins: [
//       // 'react-native-reanimated/plugin', // 👈 MUST be last
//     ],
//   }
// }


module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: ["nativewind/babel"],
  }
}