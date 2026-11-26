const { errorHttp } = require('./errorHandler');

module.exports = function hanyaRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw errorHttp(403, 'Akses ditolak: role Anda tidak memiliki izin');
    }
    next();
  };
};
