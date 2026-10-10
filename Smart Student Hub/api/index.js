const { parse, stringify } = require('querystring');
const app = require('../server');

module.exports = (req, res) => {
  const [pathname, search = ''] = req.url.split('?');

  if (req.body !== undefined && !req._body) {
    if (typeof req.body === 'string' && req.headers['content-type']?.includes('application/json')) {
      try {
        req.body = JSON.parse(req.body);
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid JSON' });
      }
    }

    req._body = true;
  }

  if (pathname === '/api/index' && search) {
    const query = parse(search);
    const forwardedPath = query.__vercel_path;

    if (typeof forwardedPath === 'string' && forwardedPath) {
      delete query.__vercel_path;
      req.url = `/api/${forwardedPath}${Object.keys(query).length ? `?${stringify(query)}` : ''}`;
    }
  }

  return app(req, res);
};
