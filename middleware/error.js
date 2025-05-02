// Middleware para tratamento central de erros
const errorHandler = (err, req, res, next) => {
  // Log detalhado do erro para o servidor
  console.error(err.stack);

  // Determina código de status baseado no erro
  const statusCode = err.statusCode || 500;

  // Resposta formatada
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Ocorreu um erro interno no servidor',
    // Inclui stack trace apenas em ambiente de desenvolvimento
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
