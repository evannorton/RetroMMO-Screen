const fs = require("fs");
const path = require("path");
const { createCanvas, Image } = require("canvas");

// Parameters
const colorPalette = {
  famicube: [
    0x00000000, // Transparent
    0xff000000,
    0xff00177d,
    0xff024aca,
    0xff0084ff,
    0xff5ba8ff,
    0xff98dcff,
    0xff9ba0ef,
    0xff6264dc,
    0xff3d34a5,
    0xff211640,
    0xff5a1991,
    0xff6a31ca,
    0xffa675fe,
    0xffe2c9ff,
    0xfffec9ed,
    0xffd59cfc,
    0xffcc69e4,
    0xffa328b3,
    0xff871646,
    0xffcf3c71,
    0xffff82ce,
    0xffffe9c5,
    0xfff5b784,
    0xffe18289,
    0xffda655e,
    0xff823c3d,
    0xff4f1507,
    0xffe03c28,
    0xffe2d7b5,
    0xffc59782,
    0xffae6c37,
    0xff5c3c0d,
    0xff231712,
    0xffad4e1a,
    0xfff68f37,
    0xffffe737,
    0xffffbb31,
    0xffcc8f15,
    0xff939717,
    0xffb6c121,
    0xffeeffa9,
    0xffbeeb71,
    0xff8cd612,
    0xff6ab417,
    0xff376d03,
    0xff172808,
    0xff004e00,
    0xff139d08,
    0xff58d332,
    0xff20b562,
    0xff00604b,
    0xff005280,
    0xff0a98ac,
    0xff25e2cd,
    0xffbdffca,
    0xff71a6a1,
    0xff415d66,
    0xff0d2030,
    0xff151515,
    0xff343434,
    0xff7b7b7b,
    0xffa8a8a8,
    0xffd7d7d7,
    0xffffffff,
  ],
  replace: [
    0x00000000, // Transparent
    0xff000000, // Black
    0xff0d0d0d,
    0xff272727, // Clothes Primary
    0xff414141,
    0xff5b5b5b, // Clothes Secondary
    0xff757575,
    0xff8f8f8f,
    0xffc3c3c3, // Hair Color
    0xffdddddd,
    0xfff7f7f7, // Skin Color
  ],
  combined: [
    0x00000000, // Transparent
    0xff000000,
    0xff00177d,
    0xff024aca,
    0xff0084ff,
    0xff5ba8ff,
    0xff98dcff,
    0xff9ba0ef,
    0xff6264dc,
    0xff3d34a5,
    0xff211640,
    0xff5a1991,
    0xff6a31ca,
    0xffa675fe,
    0xffe2c9ff,
    0xfffec9ed,
    0xffd59cfc,
    0xffcc69e4,
    0xffa328b3,
    0xff871646,
    0xffcf3c71,
    0xffff82ce,
    0xffffe9c5,
    0xfff5b784,
    0xffe18289,
    0xffda655e,
    0xff823c3d,
    0xff4f1507,
    0xffe03c28,
    0xffe2d7b5,
    0xffc59782,
    0xffae6c37,
    0xff5c3c0d,
    0xff231712,
    0xffad4e1a,
    0xfff68f37,
    0xffffe737,
    0xffffbb31,
    0xffcc8f15,
    0xff939717,
    0xffb6c121,
    0xffeeffa9,
    0xffbeeb71,
    0xff8cd612,
    0xff6ab417,
    0xff376d03,
    0xff172808,
    0xff004e00,
    0xff139d08,
    0xff58d332,
    0xff20b562,
    0xff00604b,
    0xff005280,
    0xff0a98ac,
    0xff25e2cd,
    0xffbdffca,
    0xff71a6a1,
    0xff415d66,
    0xff0d2030,
    0xff151515,
    0xff343434,
    0xff7b7b7b,
    0xffa8a8a8,
    0xffd7d7d7,
    0xffffffff,
    0xff0d0d0d,
    0xff272727,
    0xff414141,
    0xff5b5b5b,
    0xff757575,
    0xff8f8f8f,
    0xffc3c3c3,
    0xffdddddd,
    0xfff7f7f7,
  ],
  questBanners: [
    0x00000000, // Transparent
    0xff000000,
    0xff151515,
  ]
};

const defaultDirectoryOptions = {
  colorCount: 8,
  directoryPath: ["images"],
  isSpriteSheet: false,
  palette: colorPalette.famicube,
  spriteWidth: null,
  spriteHeight: null,
  size: null
};

const directoryOptions = [
  {
    colorCount: 8,
    directoryPath: ["images", "abilities"],
    isSpriteSheet: false,
    palette: colorPalette.famicube,
    spriteWidth: null,
    spriteHeight: null,
    size: { width: 16, height: 16, tiledX: false, tiledY: false }
  },
  {
    colorCount: 12,
    directoryPath: ["images", "actors"],
    isSpriteSheet: true,
    palette: colorPalette.famicube,
    spriteWidth: 16,
    spriteHeight: 16,
    size: { width: 64, height: 64, tiledX: false, tiledY: false }
  },
  {
    colorCount: 8,
    directoryPath: ["images", "banks"],
    isSpriteSheet: true,
    palette: colorPalette.famicube,
    spriteWidth: 16,
    spriteHeight: 16,
    size: { width: 64, height: 16, tiledX: false, tiledY: false }
  },
  {
    colorCount: 8,
    directoryPath: ["images", "battle-impact-animations"],
    isSpriteSheet: true,
    palette: colorPalette.famicube,
    spriteWidth: 24,
    spriteHeight: 40,
    size: { width: 192, height: 40, tiledX: false, tiledY: false }
  },
  {
    colorCount: 8,
    directoryPath: ["images", "bodies"],
    isSpriteSheet: true,
    palette: colorPalette.replace,
    spriteWidth: 16,
    spriteHeight: 16,
    size: { width: 64, height: 64, tiledX: false, tiledY: false }
  },
  {
    colorCount: 12,
    directoryPath: ["images", "bottom-bar-icons"],
    isSpriteSheet: false,
    palette: colorPalette.famicube,
    spriteWidth: null,
    spriteHeight: null,
    size: null
  },
  {
    colorCount: 8,
    directoryPath: ["images", "buttons"],
    isSpriteSheet: false,
    palette: colorPalette.famicube,
    spriteWidth: null,
    spriteHeight: null,
    size: { width: 16, height: 8, tiledX: false, tiledY: false }
  },
  {
    colorCount: 8,
    directoryPath: ["images", "chests"],
    isSpriteSheet: true,
    palette: colorPalette.famicube,
    spriteWidth: 16,
    spriteHeight: 16,
    size: { width: 64, height: 16, tiledX: false, tiledY: false }
  },
  {
    colorCount: 8,
    directoryPath: ["images", "combination-locks"],
    isSpriteSheet: true,
    palette: colorPalette.famicube,
    spriteWidth: 16,
    spriteHeight: 16,
    size: { width: 16, height: 16, tiledX: false, tiledY: false }
  },
  {
    colorCount: 8,
    directoryPath: ["images", "dials"],
    isSpriteSheet: false,
    palette: colorPalette.famicube,
    spriteWidth: null,
    spriteHeight: null,
    size: { width: 15, height: 24, tiledX: false, tiledY: false }
  },
  {
    colorCount: 8,
    directoryPath: ["images", "emotes"],
    isSpriteSheet: false,
    palette: colorPalette.famicube,
    spriteWidth: null,
    spriteHeight: null,
    size: { width: 16, height: 16, tiledX: false, tiledY: false }
  },
  {
    colorCount: 12,
    directoryPath: ["images", "heads"],
    isSpriteSheet: true,
    palette: colorPalette.replace,
    spriteWidth: 16,
    spriteHeight: 16,
    size: { width: 64, height: 64, tiledX: false, tiledY: false }
  },
  {
    colorCount: 8,
    directoryPath: ["images", "indicators"],
    isSpriteSheet: false,
    palette: colorPalette.famicube,
    spriteWidth: null,
    spriteHeight: null,
    size: { width: 16, height: 16, tiledX: false, tiledY: false }
  },
  {
    colorCount: 8,
    directoryPath: ["images", "items"],
    isSpriteSheet: false,
    palette: colorPalette.famicube,
    spriteWidth: null,
    spriteHeight: null,
    size: { width: 16, height: 16, tiledX: false, tiledY: false }
  },
  {
    colorCount: 24,
    directoryPath: ["images", "landscapes"],
    isSpriteSheet: false,
    palette: colorPalette.famicube,
    spriteWidth: null,
    spriteHeight: null,
    size: { width: 304, height: 240, tiledX: false, tiledY: false }
  },
  {
    colorCount: 8,
    directoryPath: ["images", "monsters"],
    isSpriteSheet: false,
    palette: colorPalette.famicube,
    spriteWidth: null,
    spriteHeight: null,
    size: null
  },
  {
    colorCount: 8,
    directoryPath: ["images", "quest-banners"],
    isSpriteSheet: false,
    palette: colorPalette.questBanners,
    spriteWidth: null,
    spriteHeight: null,
    size: { width: 16, height: 16, tiledX: false, tiledY: false }
  },
  {
    colorCount: 8,
    directoryPath: ["images", "quest-icons"],
    isSpriteSheet: false,
    palette: colorPalette.famicube,
    spriteWidth: null,
    spriteHeight: null,
    size: { width: 16, height: 16, tiledX: false, tiledY: false }
  },
  {
    colorCount: 8,
    directoryPath: ["images", "panels"],
    isSpriteSheet: true,
    palette: colorPalette.famicube,
    spriteWidth: 16,
    spriteHeight: 16,
    size: null
  },
  {
    colorCount: 4,
    directoryPath: ["images", "resource-bar-icons"],
    isSpriteSheet: false,
    palette: colorPalette.famicube,
    spriteWidth: null,
    spriteHeight: null,
    size: { width: 7, height: 7, tiledX: false, tiledY: false }
  },
  {
    colorCount: 16,
    directoryPath: ["images", "tabs"],
    isSpriteSheet: false,
    palette: colorPalette.famicube,
    spriteWidth: null,
    spriteHeight: null,
    size: { width: 124, height: 21, tiledX: false, tiledY: false }
  },
  {
    colorCount: 8,
    directoryPath: ["images", "tilesets"],
    isSpriteSheet: true,
    palette: colorPalette.famicube,
    spriteWidth: 16,
    spriteHeight: 16,
    size: { width: 16, height: 16, tiledX: true, tiledY: true }
  },
  {
    colorCount: 8,
    directoryPath: ["images", "slots"],
    isSpriteSheet: true,
    palette: colorPalette.famicube,
    spriteWidth: 18,
    spriteHeight: 18,
    size: { width: 18, height: 18, tiledX: true, tiledY: true }
  },
];

// Classes
class BitmapData {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.buffer = new ArrayBuffer(4 * this.width * this.height);
    this.ui8_view = new Uint8Array(this.buffer);
    this.ui32_view = new Uint32Array(this.buffer);
    this.ui32_view.fill(0x00000000);
    // Metadata for logging purposes
    this.region_offset_x = null;
    this.region_offset_y = null;
    this.region_width = null;
    this.region_height = null;
  }

  setFromImageData(imageData) {
    const buffer = imageData.data;
    for (let i = 0; i < buffer.length; i += 4) {
      // 3210 -> 3012
      // ABGR -> ARGB
      this.ui8_view[i + 0] = buffer[i + 2];
      this.ui8_view[i + 1] = buffer[i + 1];
      this.ui8_view[i + 2] = buffer[i + 0];
      this.ui8_view[i + 3] = buffer[i + 3];
    }
  }

  createBitmapDataFromRegion(rx, ry, rwidth, rheight) {
    const bitmapDataRegion = new BitmapData(rwidth, rheight);
    for (let j = 0; j < rheight; j++) {
      for (let i = 0; i < rwidth; i++) {
        const value = this.get(rx + i, ry + j);
        bitmapDataRegion.set(i, j, value);
      }
    }
    bitmapDataRegion.region_offset_x = rx;
    bitmapDataRegion.region_offset_y = ry;
    bitmapDataRegion.region_width = rwidth;
    bitmapDataRegion.region_height = rheight;
    return bitmapDataRegion;
  }

  set(x, y, value) {
    if ((x < 0 || x >= this.width || y < 0 || y >= this.height) === false) {
      if (isNaN(parseInt(value)) === false) {
        this.ui32_view[x + y * this.width] = value;
      }
    }
  }

  get(x, y) {
    if ((x < 0 || x >= this.width || y < 0 || y >= this.height) === false) {
      return this.ui32_view[x + y * this.width];
    }
  }

  normalizeAlpha() {
    for (let j = 0; j < this.height; j++) {
      for (let i = 0; i < this.width; i++) {
        const value = this.get(i, j);
        if (value < 0xff000000) {
          this.set(i, j, 0x00000000);
        }
      }
    }
  }
}

// Helper functions
const generatePaths = (basePath) => {
  // Returns an array of arrays of the path segments for use with path.join()
  const paths = [];
  fs.readdirSync(path.join(...basePath)).forEach((file) => {
    const filePath = path.join(...basePath, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      paths.push(...generatePaths([...basePath, file]));
    }
    else {
      paths.push([...basePath, file]);
    }
  });
  return paths;
};

const createBitmapDataFromPath = (imagePath) => {
  // Load Image
  const fileBuffer = fs.readFileSync(path.join(...imagePath));
  const image = new Image();
  image.src = fileBuffer;
  // Canvas
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  // Image Data
  const imageData = context.getImageData(0, 0, image.width, image.height);
  // Create Bitmap instance from image data
  const width = image.width;
  const height = image.height;
  const bitmapData = new BitmapData(width, height);
  bitmapData.setFromImageData(imageData);
  return bitmapData;
};

const compareArrays = (arrayA, arrayB) => {
  if (arrayA.length !== arrayB.length) {
    return false;
  }
  for (let i = 0; i < arrayA.length; i++) {
    if (arrayA[i] !== arrayB[i]) {
      return false;
    }
  }
  return true;
};

const getOptionsFromPath = (imagePath) => {
  for (let i = 0; i < directoryOptions.length; i++) {
    const basePath = directoryOptions[i].directoryPath;
    if (compareArrays(imagePath.slice(0, basePath.length), basePath)) {
      return directoryOptions[i];
    }
  }
  return defaultDirectoryOptions;
};

const splitBitmap = (bitmapData, options) => {
  const bitmapDataRegions = [];
  if (options.isSpriteSheet) {
    // Split into regions
    const spritesX = Math.floor(bitmapData.width / options.spriteWidth);
    const spritesY = Math.floor(bitmapData.height / options.spriteHeight);
    for (let j = 0; j < spritesY; j++) {
      for (let i = 0; i < spritesX; i++) {
        const bitmapDataRegion = bitmapData.createBitmapDataFromRegion(
          i * options.spriteWidth,
          j * options.spriteHeight,
          options.spriteWidth,
          options.spriteHeight
        );
        bitmapDataRegions.push(bitmapDataRegion);
      }
    }
  }
  else {
    // Use the whole image
    bitmapDataRegions.push(bitmapData);
  }
  return bitmapDataRegions;
};

const formatRegionLocation = (bitmapData) => {
  if (bitmapData.region_offset_x !== null) {
    // Region Meta Data
    const x = bitmapData.region_offset_x.toString().padStart(3);
    const y = bitmapData.region_offset_y.toString().padStart(3);
    const w = bitmapData.region_width.toString().padStart(3);
    const h = bitmapData.region_height.toString().padStart(3);
    return `Region = { x: ${x}, y: ${y}, w: ${w}, h: ${h} }`;
  }
  else {
    // Full image
    const x = (0).toString().padStart(3);
    const y = (0).toString().padStart(3);
    const w = bitmapData.width.toString().padStart(3);
    const h = bitmapData.height.toString().padStart(3);
    return `Region = { x: ${x}, y: ${y}, w: ${w}, h: ${h} }`;
  }
};

// Verification Functions

const verifyDimensions = (bitmapData, options, errorList) => {
  if (options.size !== null) {
    const validWidth = options.size.tiledX ? (bitmapData.width % options.size.width === 0) : (bitmapData.width === options.size.width);
    const validHeight = options.size.tiledY ? (bitmapData.height % options.size.height === 0) : (bitmapData.height === options.size.height);
    if (validWidth === false || validHeight === false) {
      errorList.push(
        [
          "INVALID SIZE    ",
          `Size = ( ${bitmapData.width} x ${bitmapData.height} )`,
          `Required Size = ( ${options.size.width}${options.size.tiledX ? 'n' : ''} x ${options.size.height}${options.size.tiledY ? 'm' : ''} )`,
        ].join("\t")
      );
    }
  }
};

const verifyTransparency = (bitmapData, _options, errorList) => {
  // Loop through image and test each pixel
  const invalidColors = new Set();
  for (let i = 0; i < bitmapData.ui32_view.length; i++) {
    const invalidAlpha =
      bitmapData.ui32_view[i] >= 0x01000000 &&
      bitmapData.ui32_view[i] < 0xff000000;
    if (invalidAlpha) {
      invalidColors.add(bitmapData.ui32_view[i].toString(16).padStart(8, "0"));
    }
  }
  if (invalidColors.size > 0) {
    errorList.push(
      [
        "INVALID ALPHA   ",
        formatRegionLocation(bitmapData),
        `Invalid Colors = (${[...invalidColors.values()].join(" ")})`,
      ].join("\t")
    );
  }
};

const verifyPalette = (bitmapData, options, errorList) => {
  const invalidColors = new Set();
  for (let i = 0; i < bitmapData.ui32_view.length; i++) {
    const isValidColor =
      options.palette.indexOf(bitmapData.ui32_view[i]) !== -1;
    if (!isValidColor) {
      invalidColors.add(bitmapData.ui32_view[i].toString(16).padStart(8, "0"));
    }
  }
  if (invalidColors.size > 0) {
    errorList.push(
      [
        "INVALID COLOR   ",
        formatRegionLocation(bitmapData),
        `Invalid Colors = (${[...invalidColors.values()].join(" ")})`,
      ].join("\t")
    );
  }
};

const verifyColorCount = (bitmapData, options, errorList) => {
  // Create a map for each color
  const colors = new Set();
  for (let i = 0; i < bitmapData.ui32_view.length; i++) {
    colors.add(bitmapData.ui32_view[i]);
  }
  if (colors.size > options.colorCount) {
    errorList.push(
      [
        "OVER COLOR COUNT",
        formatRegionLocation(bitmapData),
        `Color Count = ${colors.size} (${colors.size - options.colorCount} over)`,
        `Colors = (${[...colors.values()].map(color => color.toString(16).padStart(8, "0")).join(" ")})`
      ].join("\t")
    );
  }
};

// Core Logic

const verifyImagesContents = (basePath, scriptOptions) => {
  const output = [];
  const paths = generatePaths(basePath);
  let errorCount = 0;
  let invalidImageCount = 0;
  for (let i = 0; i < paths.length; i++) {
    const bitmapData = createBitmapDataFromPath(paths[i]);
    const options = getOptionsFromPath(paths[i]);
    const bitmapDataRegions = splitBitmap(bitmapData, options);
    const errorList = [];
    if (scriptOptions.checkDimensions) {
      verifyDimensions(bitmapData, options, errorList);
    }
    for (let j = 0; j < bitmapDataRegions.length; j++) {
      if (scriptOptions.checkTransparency) {
        verifyTransparency(bitmapDataRegions[j], options, errorList);
      }
      bitmapDataRegions[j].normalizeAlpha();
      if (scriptOptions.checkPalette) {
        verifyPalette(bitmapDataRegions[j], options, errorList);
      }
      if (scriptOptions.checkColorCount) {
        verifyColorCount(bitmapDataRegions[j], options, errorList);
      }
    }
    if (errorList.length > 0) {
      output.push(`Problems found in "${path.join(...paths[i])}"`);
      for (let i = 0; i < errorList.length; i++) {
        output.push("\t" + errorList[i]);
        errorCount++;
      }
      invalidImageCount++;
      output.push("");
    }
  }
  output.push(`Image Count: ${paths.length}`);
  output.push(`Problem Images: ${invalidImageCount}`);
  output.push(`Total Problems: ${errorCount}`);
  if (scriptOptions.saveOutputToFile) {
    const outputFolderPath = path.join("scripts", "output");
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath);
    }
    fs.writeFileSync(
      path.join(outputFolderPath, "verifyImagesContents.txt"),
      output.join("\n")
    );
  }
  if (scriptOptions.logOutputToConsole) {
    output.forEach((line) => console.log(line));
  }
  if (errorCount === 0) {
    console.log("Images contents verification succeeded.");
  }
  else {
    console.error("Images contents verification failed.");
    if (scriptOptions.enableExitStatus) {
      process.exit(1);
    }
  }
};

// CLI Functions

const displayHelpInfo = () => {
  console.log("Usage: verifyImagesContents [options]\n");
  console.log("Options:\n");
  console.log("  -A, --all                     Check for all errors");
  console.log("  -a, --checkAlpha              Check if alpha values are not 0 or 255");
  console.log("  -c, --checkCount              Check if unique colors in an image are over limit");
  console.log("  -d, --checkDimensions         Check if an image has the correct size");
  console.log("  -e, --exitStatus              Exit with failure code if verification fails");
  console.log("  -h, --help                    Display help information");
  console.log("  -l, --logOutput               Log script output to the console");
  console.log("  -o, --saveOutput              Write script output to text file");
  console.log("  -p, --checkColors             Check if colors are not from the palette");
};

const parseOptions = () => {
  const args = process.argv.slice(2);
  const scriptOptions = {
    checkColorCount: false,
    checkDimensions: false,
    checkPalette: false,
    checkTransparency: false,
    enableExitStatus: false,
    logOutputToConsole: false,
    saveOutputToFile: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case "-A":
      case "--all":
        scriptOptions.checkTransparency = true;
        scriptOptions.checkPalette = true;
        scriptOptions.checkColorCount = true;
        scriptOptions.checkDimensions = true;
        break;
      case "-a":
      case "--checkAlpha":
        scriptOptions.checkTransparency = true;
        break;
      case "-c":
      case "--checkCount":
        scriptOptions.checkColorCount = true;
        break;
      case "-d":
      case "--checkDimensions":
        scriptOptions.checkDimensions = true;
        break;
      case "-e":
      case "--exitStatus":
        scriptOptions.enableExitStatus = true;
        break;
      case "-h":
      case "--help":
        // Display help info and exit early
        displayHelpInfo();
        return null;
      case "-l":
      case "--logOutput":
        scriptOptions.logOutputToConsole = true;
        break;
      case "-o":
      case "--saveOutput":
        scriptOptions.saveOutputToFile = true;
        break;
      case "-p":
      case "--checkColors":
        scriptOptions.checkPalette = true;
        break;
      default:
        console.log(`Unrecognized argument ${arg}`);
        break;
    }
  }
  return scriptOptions;
};

// Main

const run = () => {
  const scriptOptions = parseOptions();
  if (scriptOptions !== null) {
    console.time("Total Time");
    verifyImagesContents(["images"], scriptOptions);
    console.timeEnd("Total Time");
  }
};

run();