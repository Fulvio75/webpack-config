const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let mode = "development";
let target = "web";

if (process.env.NODE_ENV === "production") {
  mode = "production";
  target = "browserslist"
};

module.exports = {
  mode: mode,
  target: target,

  module: {
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i,
        // Ricorda che webpack legge da destra a sinistra: quindi se viene trovato un file
        // css, prima viene applicato il caricatore "css-loader" e poi "MCEP"
        use: [
          MiniCssExtractPlugin.loader, 
          "css-loader", 
          "postcss-loader", 
          "sass-loader"
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },
    ]
  },

  plugins: [
    new MiniCssExtractPlugin()
  ],

  devtool: "source-map",
  devServer: {
    static: './dist',
    hot: true,
  },
};