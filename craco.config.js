require("dotenv-cra").config(); // https://github.com/gsoft-inc/craco/issues/180

const CracoCompatibility = require("./plugins/craco-compatibility");
const CracoWasm = require("./plugins/craco-wasm");
const CracoSilence = require("./plugins/craco-silence");

module.exports = {
  plugins: [
    {
      plugin: CracoCompatibility,
    },
    {
      plugin: CracoWasm,
    },
    {
      plugin: CracoSilence,
    },
  ],
};
