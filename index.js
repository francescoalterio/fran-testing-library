#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

const currentPath = __dirname.split(path.sep);
currentPath.pop();
currentPath.pop();

const projectPath = currentPath.join("/");

async function getAllTests(currentPath, pathList = [], allRoutePaths = []) {
  pathList.pop();

  const allDirFiles = await fs.promises.readdir(currentPath);
  const testFiles = allDirFiles.filter((x) => x.includes(".test.js"));
  if (testFiles.length > 0) {
    testFiles.forEach((x) => allRoutePaths.push(`${currentPath}/${x}`));
  }

  const contentDir = await fs.promises.opendir(currentPath);
  for await (const dirent of contentDir) {
    if (dirent.isDirectory()) {
      pathList.push(`${currentPath}/${dirent.name}`);
    }
  }

  if (pathList.length > 0) {
    return getAllTests(pathList[pathList.length - 1], pathList, allRoutePaths);
  } else {
    return allRoutePaths;
  }
}

const allTestFiles = async () => {
  const allFiles = await getAllTests(projectPath);
  const allFunctionsTests = fs.readFileSync(
    path.join(__dirname, "testAPI", "index.js"),
    "utf8"
  );
  const allFilesContent = allFiles.map((file) => {
    const contentFile = fs.readFileSync(file, "utf8");
    return { filePath: file, contentFile };
  });
  allFilesContent.forEach(async (file) => {
    await fs.promises.writeFile(
      file.filePath,
      `${allFunctionsTests}\n${file.contentFile}`,
      "ascii"
    );
  });
  console.time("TIME");
  allFiles.forEach((file) => {
    exec(`node ${file}`, { encoding: "utf8" }, (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      allFilesContent.forEach((file) => {
        fs.writeFileSync(file.filePath, file.contentFile, "ascii");
      });
    });
  });
  console.timeEnd("TIME");
};

allTestFiles();
