// Ci serve per output.path, che a sua volta ci serve per CleanWebpackPlugin,
// che a sua volta, se fosse aggiornato, non richiederebbe output.path :(
// Il modulo "path" viene distribuito con NodeJS, quindi non è necessario installarlo,
// è sufficiente richiederne l'uso.
const path = require("path");

const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Per generare un file HTML da un modello e distribuirlo senza aver timore di doverlo 
// preservare dalla cancellazione
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Per ripulire la cartella di distribuzione automaticamente a ogni build
const { CleanWebpackPlugin } = require("clean-webpack-plugin");


let mode = "development";
let target = "web";

// Alcune transpilazioni eseguite da alcuni plugin (come React Fast Refresh) 
// possono essere abilitate solo in modalità di sviluppo, pena un fallimento di compilazione 
// se si opera in modalità di produzione.
const plugins = [
  // Mettiamo il plugin di pulizia in cima [J.C. l'ha sempre visto lì]
  new CleanWebpackPlugin(),

  new MiniCssExtractPlugin(),

  // Comportamento di default: viene creata nella cartella destinazione un 
  // file index.html con alcune dipendenze
  // new HtmlWebpackPlugin()

  // Qui abbiamo esplicitamente detto qual è il modello da cui partire. Siccome
  // il plugin seguente + webpack si curano di iniettare le dipendenze, dobbiamo
  // rimuoverle per non averle presenti "duplicate" nel file index.html che viene generato
  // nella cartella di destinazione "dist".
  new HtmlWebpackPlugin({
    template: "./src/index.html"
  }),
];

if (process.env.NODE_ENV === "production") {
  mode = "production";
  target = "browserslist";
} 
if (process.env.SERVE) {
  // Plugin per il caricamento a caldo di React, senza che venga perso lo stato React
  plugins.push(new ReactRefreshWebpackPlugin());
};

module.exports = {
  mode: mode,
  target: target,

  // Necessario solo per l'hot reloading React, che però funziona già
  // con le versioni di componenti esistenti nel momento in cui questo esercizio
  // è stato svolto.
  // entry: "./src/index.js",

  // Per mantenere l'output più organizzato e depositare i contenuti della build in apposite cartelle
  output: {
    // Questa proprietà ci serve solo per far funzionare correttamente CleanWebpackPlugin 
    // (purtroppo il plugin non è aggiornato) oppure se si vuole usare un percorso di distribuzione
    // differente dal default, che è "dist". Noi siamo nel primo caso.
    // J.C. fa notare che, mentre altrove nel file di configurazione si possono serenamente usare
    // percorsi relativi [es.: "./src/index.html"], qui bisogna usare questa bizzarra sintassi
    // poiché è necessario che venga prodotto un percorso assoluto
    // path: "./dist",  <-- Questo non funziona: "configuration.output.path: The provided value "./dist" is not an absolute path!"
    // Se dalla console invochi "node" e poi al prompt di node "path.resolve()", vedrai il percorso in cui ti trovi.
    // __dirname individua la directory in cui si trova il file in cui si trova questo comando.
    path: path.resolve(__dirname, "dist"),

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

  plugins: plugins,

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