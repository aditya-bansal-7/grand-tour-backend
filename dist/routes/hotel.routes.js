"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hotel_controller_1 = require("../controllers/hotel.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Student routes
router.get('/my-assignment', auth_middleware_1.requireAuth, hotel_controller_1.getMyAssignment);
// Admin routes
router.get('/', auth_middleware_1.requireAuth, (0, auth_middleware_1.restrictTo)('ADMIN', 'SUPER_ADMIN'), hotel_controller_1.getHotels);
router.post('/', auth_middleware_1.requireAuth, (0, auth_middleware_1.restrictTo)('ADMIN', 'SUPER_ADMIN'), hotel_controller_1.createHotel);
router.put('/:id', auth_middleware_1.requireAuth, (0, auth_middleware_1.restrictTo)('ADMIN', 'SUPER_ADMIN'), hotel_controller_1.updateHotel);
router.delete('/:id', auth_middleware_1.requireAuth, (0, auth_middleware_1.restrictTo)('ADMIN', 'SUPER_ADMIN'), hotel_controller_1.deleteHotel);
router.get('/candidates', auth_middleware_1.requireAuth, (0, auth_middleware_1.restrictTo)('ADMIN', 'SUPER_ADMIN'), hotel_controller_1.getCandidatesAtHotelStep);
router.post('/assign', auth_middleware_1.requireAuth, (0, auth_middleware_1.restrictTo)('ADMIN', 'SUPER_ADMIN'), hotel_controller_1.assignHotel);
exports.default = router;
