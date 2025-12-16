// middleware/auth.js
// Um "segurança" que verifica se o "crachá" (sessão) existe

const isAuth = (req, res, next) => {
  const hasValidSession = req.session?.userId;

  if (hasValidSession) {
    // Tem crachá válido. Pode passar (next)
    return next();
  }

  // Não tem crachá. Volta pro Login
  return res.redirect('/login');
};

module.exports = isAuth;
