const userModel = require('../model/user.js');
const userDetailModel = require('../model/personalDetails.js');
const userNotes = require('../model/notes.js');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const { SECRET } = process.env;

// -------------------------------------------------register user
exports.register = async (req, res) => {
  const { userName, password } = req.body;
  if (!userName) {
    return res.status(400).send({
      success: false,
      message: 'user name is required! please enter user name',
    });
  }
  if (!password) {
    return res.status(400).send({
      success: false,
      message: 'password is required! please enter password',
    });
  }
  const alreadyUser = await userModel.findOne({ userName }).exec();
  if (alreadyUser) {
    return res.status(400).send({
      success: false,
      message: 'user already exist please login',
    });
  } else {
    const user = await new userModel({
      userName,
      password,
    });
    try {
      user.save();
    } catch (error) {
      res.status(400).send({
        success: false,
        error: error,
      });
    }
    res.status(200).send({
      success: true,
      message: 'user is registered successfully',
    });
  }
};

// -------------------------------------------------login user

exports.login = async (req, res) => {
  const { userName, password } = req.body;
  if (!userName) {
    return res.status(400).send({
      success: false,
      message: 'user name is required! please enter user name',
    });
  }
  if (!password) {
    return res.status(400).send({
      success: false,
      message: 'password is required! please enter password',
    });
  }

  const checkUser = await userModel
    .findOne({
      userName,
    })
    .exec();
  if (checkUser) {
    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if (!checkPassword) {
      res.status(403).send({
        success: false,
        message: 'incorrect password',
      });
    } else {
      //   ------------------------------------ generating jwt token

      const token = jwt.sign(
        {
          id: checkUser._id,
          userName,
          password: checkUser.password,
        },
        SECRET,
        {}
      );
      res.header('auth', token).send({
        success: true,
        message: 'Logedin ',
      });
    }
  } else {
    res.status(403).send({
      success: false,
      message: 'user not found',
    });
  }
};

// -------------------------------------------------personal details
exports.personalDetails = async (req, res) => {
  const { age, height, weight, cycleLength, lastPeriodDate, periodLength } =
    req.body;
  if (!age) {
    return res.status(400).send({
      success: false,
      message: 'age is required! please enter age',
    });
  }
  if (!weight) {
    return res.status(400).send({
      success: false,
      message: 'weight is required! please enter weight',
    });
  }
  if (!height) {
    return res.status(400).send({
      success: false,
      message: 'height is required! please enter height',
    });
  }
  if (!cycleLength) {
    return res.status(400).send({
      success: false,
      message: 'cycleLength is required! please enter cycleLength',
    });
  }
  if (!lastPeriodDate) {
    return res.status(400).send({
      success: false,
      message: 'lastPeriodDate is required! please enter lastPeriodDate',
    });
  }
  if (!periodLength) {
    return res.status(400).send({
      success: false,
      message: 'periodLength is required! please enter periodLength',
    });
  }
  const personalDetails = await new userDetailModel({
    age,
    weight,
    height,
    cycleLength,
    lastPeriodDate,
    periodLength,
  });
  const updateUser = await userModel.findOneAndUpdate(
    { _id: userId },
    { $set: { details: personalDetails } }
  );

  try {
    await updateUser.save();
    await personalDetails.save();
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error,
    });
  }
  res.status(200).send({
    success: true,
    message: 'personal data saved',
  });
};

// -------------------------------------------------home Page
exports.homePage = async (req, res) => {
  try {
    const userInfo = await userModel.findOne({ _id: userId });
    const data = await userDetailModel
      .find(
        { _id: userInfo.details },
        {
          _id: 0,
          cycleLength: 1,
          lastPeriodDate: 1,
          periodLength: 1,
        }
      )
      .exec();

    res.status(200).send({
      success: true,
      data,
      message: 'data for home page',
    });
  } catch (error) {
    res.status(400).send({
      error: error,
    });
  }
};

// -------------------------------------------------get all notes
exports.getAllNotes = async (req, res) => {
  try {
    const ourNotes = await userNotes.find({ userId: userId }).lean();

    if (!ourNotes) {
      res.json({ message: 'no notes exist for given user doesnt exist' });
    }

    res.send(ourNotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------------------------------ add a note

exports.addNotes = async (req, res) => {
  const newNote = await new userNotes({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    userId: userId,
  });
  try {
    await newNote.save();
    res.json({ added: 'note added', note: newNote });
  } catch (error) {
    res.json({ error: error });
  }
};

//------------------------------------------ delete a note

exports.deleteNote = async (req, res) => {
  const noteId = req.body.id;
  if (!noteId) {
    return res.status(400).send({
      success: false,
      message: 'note ID is required! please enter note ID',
    });
  }
  try {
    await userNotes.findOneAndDelete({ _id: noteId });
    res.json({ delete: 'successfully deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**************************  for updating data ***************************/

exports.updateDetail = async (req, res) => {
  const { cycleLength, lastPeriodDate, periodLength } = req.body;
  const userInfo = await userModel.findOne({ _id: userId });
  const id = userInfo.details;
  const updateUser = await userDetailModel.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        // _id: id,
        cycleLength,
        lastPeriodDate,
        periodLength,
      },
    }
  );
  try {
    updateUser.save();
    res.status(200).send({
      success: true,
      message: 'peronal data is updated',
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error,
    });
  }
};
