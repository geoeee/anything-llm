/**
 * 【默认分块实现】RecursiveSplitter类
 * ------------------------------------------------
 * 这是AnythingLLM默认使用的文本分块器，是对Langchain的RecursiveCharacterTextSplitter的包装
 * RecursiveCharacterTextSplitter会递归地按照不同的分隔符（如\n\n, \n, 空格, 字符）分割文本
 * ------------------------------------------------
 */
class RecursiveSplitter {
  /**
   * 创建一个RecursiveSplitter实例
   * @param {Object} options - 配置选项
   * @param {number} options.chunkSize - 每个块的最大大小（字符数）
   * @param {number} options.chunkOverlap - 相邻块之间的重叠字符数
   * @param {string|null} options.chunkHeader - 添加到每个块开头的头部信息
   */
  constructor({ chunkSize, chunkOverlap, chunkHeader = null }) {
    const {
      RecursiveCharacterTextSplitter,
    } = require("@langchain/textsplitters");
    this.log(`Will split with`, { chunkSize, chunkOverlap });
    this.chunkHeader = chunkHeader;
    // 创建Langchain的RecursiveCharacterTextSplitter实例作为实际的分块引擎
    this.engine = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap,
    });
  }

  log(text, ...args) {
    console.log(`\x1b[35m[RecursiveSplitter]\x1b[0m ${text}`, ...args);
  }

  /**
   * 【核心实现】实际执行文本分块的方法
   * ------------------------------------------------
   * 这个方法是实际执行文本分块的地方，使用RecursiveCharacterTextSplitter引擎
   * 将文本分割成多个块，并可选择性地添加元数据头部
   * ------------------------------------------------
   * @param {string} documentText - 需要分割的文档文本
   * @returns {Promise<string[]>} - 分割后的文本块数组
   */
  async _splitText(documentText) {
    // 如果没有设置块头部，直接使用引擎分割文本
    if (!this.chunkHeader) return this.engine.splitText(documentText);
    
    // 1. 先将文本分割成多个字符串
    const strings = await this.engine.splitText(documentText);
    
    // 2. 将字符串转换为文档对象，并添加块头部
    const documents = await this.engine.createDocuments(strings, [], {
      chunkHeader: this.chunkHeader,
    });
    
    // 3. 过滤掉空内容，并提取pageContent作为最终结果
    return documents
      .filter((doc) => !!doc.pageContent)
      .map((doc) => doc.pageContent);
  }
}

module.exports = RecursiveSplitter;