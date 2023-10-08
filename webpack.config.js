const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let mode = "development";
if (process.env.NODE_ENV === "production") {
  mode = "production";
};

module.exports = {
  mode: mode,

  module: {
    rules: [
      {
        test: /\.s?css$/i,
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