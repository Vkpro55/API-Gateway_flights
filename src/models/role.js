'use strict';
const {
  Model
} = require('sequelize');

const { Enums } = require("../utils/common");
const { ADMIN, CUSTOMER, FLIGHT_COMAPANY } = Enums.USER_ROLES;

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        through: "User_Role",
        as: "user"
      })
    }
  }
  Role.init({
    name: {
      type: DataTypes.ENUM,
      values: [ADMIN, CUSTOMER, FLIGHT_COMAPANY],
      defaultValue: CUSTOMER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};


