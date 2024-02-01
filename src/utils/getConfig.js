const path = require("path");
const fs = require("fs");
/**
 * 读取配置文件
 */
export function readConfig() {
  const getConfigPath = path.join(EgVuePath, 'config.conf')
  const data = fs.readFileSync(path.resolve(getConfigPath), {encoding:'utf8', flag:'r'});
  const config = JSON.parse(data);
  return config; 
}