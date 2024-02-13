const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

let users = [];

router.get('/', (req, res) => {
  res.status(200).json({ data: users });
});

router.post('/', (req, res) => {
  const { username, age, hobbies } = req.body;

  if (!username || !age) {
    return res.status(400).json({ error: 'Username and age are required' });
  }

  const newUser = {
    id: uuidv4(),
    username,
    age,
    hobbies: hobbies || [],
  };

  users.push(newUser);
  res.status(201).json({ data: newUser });
});

router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  const foundUser = users.find((user) => user.id === userId);
  if (!foundUser) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(200).json({ data: foundUser });
});

router.put('/:userId', (req, res) => {
  const { userId } = req.params;
  const { username, age, hobbies } = req.body;
  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (username) user.username = username;
  if (age) user.age = age;
  if (hobbies) user.hobbies = hobbies;

  res
    .status(201)
    .json({ message: `user with this id ${userId} has been updated` });
});

router.delete('/:userId', (req, res) => {
  const { userId } = req.params;
  users = users.filter((user) => user.id !== userId);

  res
    .status(200)
    .json({ message: `user with this id ${userId} deleted sucessfully` });
});

module.exports = router;
