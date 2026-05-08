"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.createUser = exports.updateUserRole = exports.getUsers = void 0;
const user_service_1 = __importDefault(require("../services/user.service"));
const getUsers = async (req, res) => {
    const users = await user_service_1.default.getAllUsers();
    res.status(200).json({
        success: true,
        data: users
    });
};
exports.getUsers = getUsers;
const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const user = await user_service_1.default.updateUserRole(id, role);
    res.status(200).json({
        success: true,
        data: user
    });
};
exports.updateUserRole = updateUserRole;
const createUser = async (req, res) => {
    const user = await user_service_1.default.createUser(req.body);
    res.status(201).json({
        success: true,
        data: user
    });
};
exports.createUser = createUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    await user_service_1.default.deleteUser(id);
    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
};
exports.deleteUser = deleteUser;
