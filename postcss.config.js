var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano")
module.exports = {
    plugins: [
      autoprefixer(),
      cssnano()
    ]
};
