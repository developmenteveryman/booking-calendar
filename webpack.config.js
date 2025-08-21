const path = require('path');
const defaults = require('@wordpress/scripts/config/webpack.config.js');

module.exports = {
    ...defaults,
    output: {
        filename: '[name].js',
        path: path.resolve(process.cwd(), 'build'),
    },
};