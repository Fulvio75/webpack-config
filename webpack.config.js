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
  // Per mantenere l'output più organizzato e depositare i contenuti della build in apposite cartelle
  output: {
    // Gli elementi tra parentesi quadre non sono pienamente compresi nemmeno da J.C., in particolare Query
    assetModuleFilename: "images/[hash][ext][query]"
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        
        // Le risorse vengono generate separatamente        
        // type: "asset/resource",
        
        // Le risorse vengono riversate direttamente nel nostro JS, sotto forma 
        // di data:image/xxx;base64[codifica]
        // Inefficiente se le risorse sono grandi (e la build WP dà avvertimenti in tal senso)
        // Può aver senso per risorse piccole, poiché si riducono le richieste HTTP
        // type: "asset/inline",

        // In questo caso è webpack che decide se fare o meno l'inlining delle immagini,
        // rispetto a un limite massimo stabilito (default: 8kB, si trova nella documentazione WP)
        type: "asset",

        // // La dimensione limite per stabilire se fare o meno l'inlining delle immagini
        // // può essere specificata con la seguente indicazione
        // parser: {
        //   dataUrlCondition: {
        //     // 30 kB, scritto così per facilitarne l'interpretazione agli umani.
        //     maxSize: 30 * 1024,
        //   }
        // }

      },
      {
        test: /\.(s[ac]|c)ss$/i,
        // Ricorda che webpack legge da destra a sinistra: quindi se viene trovato un file
        // css, prima viene applicato il caricatore "css-loader" e poi "MCEP"
        use: [
          MiniCssExtractPlugin.loader, 
          // Versione retrocompatibile per evitare l'errore "publicPath"
          // {
          //   loader: MiniCssExtractPlugin.loader, 
          //   options: { publicPath: "" }
          // },
          "css-loader", 
          "postcss-loader", 
          "sass-loader"
        ],
      },
      {
        // Utilizziamo babel-loader per caricare i file js (per la transpilazione di retrocompatibilità)
        // e jsx (per la transpilazione React)
        test: /\.jsx?$/,
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

  // Estensioni che vengono inferite quando si importa da un modulo senza fornire l'estensione
  resolve: {
    extensions: [".js", ".jsx"]
  },

  devtool: "source-map",
  devServer: {
    static: './dist',
    hot: true,
  },
};