const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'secreto_super_seguro_camara_escura'
      );

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      return res.status(401).json({ error: 'Não autorizado, token inválido' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Não autorizado, nenhum token fornecido' });
  }
};

module.exports = { protect };