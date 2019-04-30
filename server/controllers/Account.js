const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

    // cast to strings to cover up some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

    // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });
    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

// Renders the account page
const accountPage = (req, res) => {
  res.render('account', { csrfToken: req.csrfToken() });
};

// Handles submission of new data for updating a password
const changePassword = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.password = `${req.body.password}`;
  req.body.newPass = `${req.body.newPass}`;
  req.body.newPass2 = `${req.body.newPass2}`;

  if (!req.body.password || !req.body.newPass || !req.body.newPass2) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (req.body.newPass !== req.body.newPass2) {
    return res.status(400).json({ message: 'New passwords do not match' });
  }

  // Authenticate the old password
  Account.AccountModel.authenticate(req.session.account.username, req.body.password,
    (err, account) => {
      if (err) {
        return res.status(401).json({ message: 'Incorrect password' });
      } else if (!account) {
        return res.status(401).json({ message: 'Account not found' });
      }
      return res.status(200).json({ message: 'Account found' });
    });

  // Hash new password
  Account.AccountModel.generateHash(req.body.newPass, (salt, hash) => {
    Account.AccountModel.changePassword(req.session.account.username, salt, hash);
  });

  return res.json({ redirect: '/maker', message: 'Password updated' });
};

const getInfo = () => {

};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.accountPage = accountPage;
module.exports.changePassword = changePassword;
module.exports.getInfo = getInfo;
