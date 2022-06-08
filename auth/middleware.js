export function checkRole(request, response, next) {
  if (!request.session.role || request.session.role === 'guest') {
    response.redirect('/login');
  } else {
    next();
  }
}

export function isAdmin(request, response, next) {
  if (request.session.role === 'admin') {
    next();
  } else {
    response.redirect('/');
  }
}
