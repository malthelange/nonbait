const path = require("path");

module.exports = {
  entry: {
    service: "./src/service-worker.ts",
    popup: "./src/popup/popup.ts",
    content: "./src/content.ts",
  },
  devtool: "inline-source-map",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};
