

/**
 * 测试
 * @class
 */
class ElectronAPI  {

  /**
   * test
   */
  async test () {

    return 'hello electron';
  }

  /**
   * test
   */
  async testUtils () {


    return "mid 11111111";
  } 

}

ElectronAPI.toString = () => '[class]';
module.exports = ElectronAPI;  