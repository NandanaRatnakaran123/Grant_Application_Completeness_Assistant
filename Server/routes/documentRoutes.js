
import express from "express";
import multer from "multer";
import { extractDocumentText } from "../services/documentService.js";

const router = express.Router();

const allowedExtensions = [".pdf", ".docx", ".txt"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const extension = "." + file.originalname.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return cb(new Error("Only PDF, DOCX, and TXT files are allowed"));
    }

    cb(null, true);
  },
});

router.post("/upload", (req, res, next) => {
  upload.single("document")(req, res, (error) => {
    if (error) return next(error);

    next();
  });
}, async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file using the "document" field',
      });
    }

    const text = await extractDocumentText(req.file);

    if (!text.trim()) {
      return res.status(422).json({
        success: false,
        message: "No readable text was found in the document",
      });
    }

    res.json({
      success: true,
      document: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        text,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
