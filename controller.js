export const userWithParameters = (req, res) => {
  const id = req.params.id;
  res.send(`Hello World! in express ch user id: ${id}`);
};

export const userWithQueryParameters = (req, res) => {
  const keywords = req.query.branch;
  res.send(`Hello World! in express ch user id: ${keywords}`);
};
