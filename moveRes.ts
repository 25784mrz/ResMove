var fileAd = '';

var i = 2;
while (i < process.argv.length) {
    var arg = process.argv[i];
    switch (arg) {
        case '--f':
        case '-f':
            var url = process.argv[i + 1];
            fileAd = url;
            i += 2;
            break;
    }
}

const fs = require('fs');
const path = require('path');

class MoveRes {

    // 读取JSON配置文件
    static readJsonConfig(filePath) {
      try {
          const data = fs.readFileSync(filePath, 'utf8');
          return JSON.parse(data);
      } catch (error) {
          console.error(`读取JSON配置文件失败: ${error.message}`);
          return null;
      }
    }

    // 遍历配置对象
    static traverseConfig(config) {
      const map = new Map();
      if (config && typeof config === 'object') {
          for (const key in config) {
              if (map.has(key)) {
              } else {
                  map.set(key, config[key]);
              }
          }
      }
      return map;
    }

    // 复制文件到目标文件夹
    static copyFiles(sourceDir, targetDir) {
      sourceDir = path.join('./../',fileAd,sourceDir);
      const files = fs.readdirSync(sourceDir);
      files.forEach((file) => {
            const sourceFilePath = path.join(sourceDir, file);
            const targetFilePath = path.join(targetDir, file);
            const stats = fs.statSync(sourceFilePath);
            if (stats.isFile() && file !=='.DS_Store') {
                if (fs.existsSync(targetFilePath)) {
                    console.log(`${targetFilePath} 已存在`);
                }else{
                    // 如果是文件，复制文件
                    fs.copyFileSync(sourceFilePath, targetFilePath);                       
                    console.log(`Copied ${sourceFilePath} to ${targetDir}`);
                }
            } else if (stats.isDirectory()) {
                // 如果是文件夹，递归调用 copyFiles
                MoveRes.copyFiles(sourceFilePath, targetDir);
            }
        });
    }


    // 示例用法
    static startMoveRes() {
        const configFilePath = path.join(__dirname, './moveResConf.json');
        const config = MoveRes.readJsonConfig(configFilePath);
        if (config) {
            const map = MoveRes.traverseConfig(config);
            console.log(map)
            map.forEach((value) => {
                try {
                    MoveRes.copyFiles(value.curPos, value.movePos);
                } catch (error) {
                    console.error('Error reading directory:', error);
                }
            });
        } else {
            console.log('无法读取配置文件');
        }
    }
}

MoveRes.startMoveRes();