// controllers/authController.js
// -------------------------------
// Responsável por autenticação (login/logout) — separado do userController

const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Funções utilitárias para lógica pura (facilita testes)
const normalizeEmail = (email) => {
  if (!email) return '';
  return email.toLowerCase().trim();
};

const createUserSession = (session, user) => {
  session.userId = user._id;
  session.userName = user.nome;
  session.nome = user.nome;
};

const logSuccessfulLogin = (user, ip) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Login bem-sucedido: email=${user.email} id=${user._id} ip=${ip}`);
};

// Login: recebe email e senha, autentica e cria sessão
exports.login = async (req, res) => {
  try {
    const { email: rawEmail, senha } = req.body;
    const email = normalizeEmail(rawEmail);

    // 1. Buscar usuário pelo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect('/login?erro=usuario');
    }

    // 2. Comparar senha com o Hash
    const isMatch = await bcrypt.compare(senha, user.password || '');
    if (!isMatch) {
      return res.redirect('/login?erro=senha');
    }

    // 3. Criar a Sessão
    createUserSession(req.session, user);

    // Log no terminal para auditoria/desenvolvimento
    logSuccessfulLogin(user, req.ip);

    return res.redirect('/users');
  } catch (err) {
    console.error('Erro em authController.login:', err);
    return res.status(500).send('Erro no login');
  }
};

// Logout: destrói a sessão e redireciona para /login
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao destruir sessão:', err);
      return res.redirect('/perfil');
    }
    // Limpar cookie de sessão explicitamente no path raiz
    res.clearCookie('connect.sid', { path: '/' });
    return res.redirect('/login');
  });
};

// Exporta funções utilitárias para testes
module.exports.normalizeEmail = normalizeEmail;
module.exports.createUserSession = createUserSession;
