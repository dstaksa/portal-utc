const withSass = require('@zeit/next-sass')
const withLess = require('@zeit/next-less');
const lessToJS = require('less-to-js');
const fs = require('fs');
const path = require('path');

const themeFile = './styles/antd-custom.less';
const themeVariables = lessToJS(themeFile, function(err){
  console.log(err ? "failed!" : "Done! created " + themeFile + ".js");
});

module.exports = withSass(
  withLess({
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVariables, // Add modifyVars property
      localIdentName: '[local]___[hash:base64:5]',
    }
  })
);

/*
module.exports = withSass({
  webpack (config, options) {
    config.module.rules.push(
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000
          }
        }
      },
      {
        test: /\.(less)/,
        loader: "emit-file-loader",
        options: {
          name: "dist/[path][name].[ext]"
        }
      },
      {
        test: /\.less$/,
        use: [
          {loader:"babel-loader"}, 
          {loader:"raw-loader"}, 
          {
            loader:"less-loader",
            options:{
              javascriptEnabled:true
            }
          }
        ]

      }
    )
    
    return config
  }
})
*/