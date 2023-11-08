const mongoose = require('mongoose');
const { usersScheme, usersModel } = require('../models');
const handlehttpError = require('../utils/handlers/handleError');
const { matchedData } = require('express-validator');
const { encrypt, compare } = require('../utils/handlers/handlePassword');
const { tokenSign } = require('../utils/handlers/handleJWT');


/**
 * Registers a user in the system.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} Returns a promise that resolves when the user is registered successfully.
 */
const register = async (req, res) => {
  try {
    req = matchedData(req);

    const existUser = await usersModel.findOne({ email: req.email });
    if (existUser) {
      handlehttpError(res, 'El usuario ya existe en la base de datos', 400);
    }

    const password = await encrypt(req.password);
    const body = { ...req, password };
    const dataUser = await usersModel.create(body);
    dataUser.set('password', undefined, { strict: false });

    if (!dataUser) {
      handlehttpError(res, 'Error al registrar el usuario', 400);
    }

    const data = {
      token: await tokenSign(dataUser),
      user: dataUser,
    };

    if (!data.token) {
      handlehttpError(res, 'Error al generar el token', 400);
    }

    res.send({ data });
  } catch (error) {
    console.error(error);
    handlehttpError(res, 'Error interno en el servidor', 500);
  }
};

/**
 * Este controlador se encarga de loguear a una persona
 *
 * @param {type} req - description of parameter
 * @param {type} res - description of parameter
 * @return {type} description of return value
 */
const login = async (req, res) => {

  
}

module.exports = { register , login};