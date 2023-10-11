// Alcune transpilazioni eseguite da alcuni plugin (come React Fast Refresh) 
// possono essere abilitate solo in modalità di sviluppo, pena un fallimento di compilazione 
// se si opera in modalità di produzione.
const plugins = []
if (process.env.NODE_ENV !== 'production')
{
  plugins.push("react-refresh/babel");
}

module.exports = {
  presets: [
    "@babel/preset-env", 
    ["@babel/preset-react", { runtime: "automatic" }]],
    plugins: plugins,
}