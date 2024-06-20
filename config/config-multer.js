import multer from "multer";
import path from "path";
import fs from "fs/promises";

const temporaryDir = path.join(process.cwd(), "tmp");
checkFolder(temporaryDir);

const stableDir = path.join(process.cwd(), "public");
checkFolder(stableDir);

const avatarsDir = path.join(stableDir, "avatars");
checkFolder(avatarsDir);

async function checkFolder(folderPath) {
  try {
    await fs.access(folderPath);
  } catch (error) {
    await fs.mkdir(folderPath);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, temporaryDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilterAvatar = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname);
  const extensionsAvaible = [".jpeg", ".png", ".bmp", ".tiff", "gif"];

  if (!extensionsAvaible.includes(fileExtension)) {
    const error = `You must enter an avatar with one of these extensions: ${extensionsAvaible.join(
      ", "
    )}`;

    cb(new Error(error));
    return;
  }

  cb(null, true);
};

const validateUploadAvatar = multer({
  storage: storage,
  fileFilter: fileFilterAvatar,
}).single("avatar");

export default validateUploadAvatar;
