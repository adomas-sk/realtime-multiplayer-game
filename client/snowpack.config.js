/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: { url: '/dist' },
  },
  plugins: ['@snowpack/plugin-typescript'],
  install: [
    /* ... */
  ],
  installOptions: {
    installTypes: true,
    treeshake: true,
  },
  devOptions: {
    open: 'none',
  },
  buildOptions: {
    /* ... */
  },
  proxy: {
    '/api/': 'http://localhost:5000/',
    '/socket.io/': {
      ws: true,
      target: 'ws://localhost:5000/socket.io',
    },
    /* ... */
  },
  alias: {
    /* ... */
  },
};
