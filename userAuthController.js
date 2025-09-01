export const login = (req, res) => {
  res.send("User login");
};

export const register = (req, res) => {
  res.send("User register");
};

export const user = (req, res) => {
  const { name, email } = req.body;
  res.json({ name, email });
};

export const userPut = (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  res.json({ id: userId, name, email });
};

export const userDelete = (req, res) => {
  const userId = req.params.id;
  res.json({ id: userId });
};
