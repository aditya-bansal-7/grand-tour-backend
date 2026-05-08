"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.updateStatus = exports.createDocument = exports.getDocuments = void 0;
const document_service_1 = __importDefault(require("../services/document.service"));
const getDocuments = async (req, res) => {
    const documents = await document_service_1.default.getAllDocuments();
    res.status(200).json({
        success: true,
        data: documents
    });
};
exports.getDocuments = getDocuments;
const createDocument = async (req, res) => {
    const document = await document_service_1.default.createDocument(req.body);
    res.status(201).json({
        success: true,
        data: document
    });
};
exports.createDocument = createDocument;
const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const reviewedBy = req.user?.id;
    const document = await document_service_1.default.updateDocumentStatus(id, status, remarks, reviewedBy);
    res.status(200).json({
        success: true,
        data: document
    });
};
exports.updateStatus = updateStatus;
const deleteDocument = async (req, res) => {
    const { id } = req.params;
    await document_service_1.default.deleteDocument(id);
    res.status(200).json({
        success: true,
        message: 'Document deleted successfully'
    });
};
exports.deleteDocument = deleteDocument;
