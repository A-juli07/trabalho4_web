// controllers/authController.test.js
// Testes unitários para funções utilitárias do authController

const { normalizeEmail, createUserSession } = require('./authController');

describe('authController - Funções Utilitárias', () => {
  // Teste 1: normalizeEmail - casos de sucesso
  describe('normalizeEmail', () => {
    test('deve normalizar email com maiúsculas para minúsculas', () => {
      const input = 'TESTE@EMAIL.COM';
      const expected = 'teste@email.com';
      expect(normalizeEmail(input)).toBe(expected);
    });

    test('deve remover espaços em branco do email', () => {
      const input = '  user@example.com  ';
      const expected = 'user@example.com';
      expect(normalizeEmail(input)).toBe(expected);
    });

    test('deve normalizar email com espaços e maiúsculas', () => {
      const input = '  Admin@EXAMPLE.com  ';
      const expected = 'admin@example.com';
      expect(normalizeEmail(input)).toBe(expected);
    });

    test('deve retornar string vazia para email null', () => {
      expect(normalizeEmail(null)).toBe('');
    });

    test('deve retornar string vazia para email undefined', () => {
      expect(normalizeEmail(undefined)).toBe('');
    });

    test('deve retornar string vazia para email vazio', () => {
      expect(normalizeEmail('')).toBe('');
    });
  });

  // Teste 2: createUserSession - casos de sucesso
  describe('createUserSession', () => {
    test('deve criar sessão com userId, userName e nome', () => {
      const mockSession = {};
      const mockUser = {
        _id: '123456789',
        nome: 'João Silva',
        email: 'joao@example.com',
      };

      createUserSession(mockSession, mockUser);

      expect(mockSession.userId).toBe('123456789');
      expect(mockSession.userName).toBe('João Silva');
      expect(mockSession.nome).toBe('João Silva');
    });

    test('deve sobrescrever sessão existente com novos dados', () => {
      const mockSession = {
        userId: 'old-id',
        userName: 'Old User',
        nome: 'Old User',
      };
      const mockUser = {
        _id: 'new-id',
        nome: 'New User',
        email: 'new@example.com',
      };

      createUserSession(mockSession, mockUser);

      expect(mockSession.userId).toBe('new-id');
      expect(mockSession.userName).toBe('New User');
      expect(mockSession.nome).toBe('New User');
    });

    test('deve manter userName e nome sincronizados', () => {
      const mockSession = {};
      const mockUser = {
        _id: '999',
        nome: 'Maria Santos',
      };

      createUserSession(mockSession, mockUser);

      // Verifica que userName e nome têm o mesmo valor
      expect(mockSession.userName).toBe(mockSession.nome);
      expect(mockSession.userName).toBe('Maria Santos');
    });
  });
});
