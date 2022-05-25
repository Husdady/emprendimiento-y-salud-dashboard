require('dotenv').config();
const webpack = require('webpack');

module.exports = {
  images: {
    domains: ['res.cloudinary.com', 'multiservicios-espay.netlify.app'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login',
        permanent: true,
      },
      {
        source: '/auth',
        destination: '/auth/login',
        permanent: true,
      },
    ]
  },
  webpack: (config) => {
    // Enable enviroment variables
    config.plugins.push(
      new webpack.EnvironmentPlugin(process.env)
    )

    // Return custom config
    return config;
  }
}