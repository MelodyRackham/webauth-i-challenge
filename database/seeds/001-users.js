exports.seed = function(knex) {
  return knex('users').insert([
    { username: 'Jamie', password: 'password' },
    { username: 'Melody', password: '@password' },
    { username: 'Mike', password: '123pass' },
  ]);
};
