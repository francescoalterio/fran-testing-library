#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);

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
  const timeStart = Date.now();
  let countPass = 0;
  let countFail = 0;
  allFilesContent.forEach(async (file, index) => {
    const { stdout, stderr } = await exec(`node ${file.filePath}`);
    console.log(stdout);
    console.log(stderr);

    const stdoutSplited = stdout.split("\n").join(" ").split(" ");
    const wordPassRepeat = stdoutSplited.filter((word) => word === "PASS");
    const wordFailRepeat = stdoutSplited.filter((word) => word === "FAIL");
    countPass += wordPassRepeat.length;
    countFail += wordFailRepeat.length;
    fs.writeFileSync(file.filePath, file.contentFile, "ascii");
    if (index === allFilesContent.length - 1) {
      const timeEnd = Date.now();
      console.log(`TIME: ${timeEnd - timeStart}ms`);
      console.log(`TEST COUNT: ${countPass + countFail}`);
      console.log(`PASSED TESTS: ${countPass}`);
      console.log(`FAILED TESTS: ${countFail}`);
    }
  });
};

allTestFiles();
