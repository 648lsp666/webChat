module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "component",
      {
        libraryName: "element-ui",
        styleLibraryName: "theme-chalk",
      },
    ],
    [
      "import",
      {
        libraryName: "@icon-park/vue",
        libraryDirectory: "es/icons",
        camel2DashComponentName: false,
      },
      "@icon-park/vue",
    ],
  ],
};
