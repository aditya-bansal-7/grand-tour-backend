"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePermission = exports.getPermissions = void 0;
const db_1 = require("../config/db");
const getPermissions = async (req, res) => {
    const permissions = await db_1.prisma.rolePermission.findMany();
    res.status(200).json({
        success: true,
        data: permissions
    });
};
exports.getPermissions = getPermissions;
const updatePermission = async (req, res) => {
    const { role } = req.params;
    const { features } = req.body;
    const updated = await db_1.prisma.rolePermission.upsert({
        where: { role: role },
        update: { features },
        create: { role: role, features }
    });
    res.status(200).json({
        success: true,
        data: updated
    });
};
exports.updatePermission = updatePermission;
