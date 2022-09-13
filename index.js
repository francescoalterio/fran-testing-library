import fs from "fs";

const projectPath =
  "C:/Users/franc/Desktop/Workspace/projects/js/fran-testing-library";

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
  console.log(allFiles);
};

allTestFiles();
