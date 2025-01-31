'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');
const { ServerConfig } = require("../config");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        notEmpty: true,
        len: [8, 100]
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(function encrypt(user) {
    const salt = bcrypt.genSaltSync(+ServerConfig.SALTROUNDS);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
  });

  return User;
};