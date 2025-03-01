/**
 * 【空白行分块实现】BlankLineSplitter类
 * ------------------------------------------------
 * 这是一个基于空白行分隔的文本分块器
 * 它会以空白行作为主要分隔符来分割文本，并确保每个块不超过最大大小限制
 * ------------------------------------------------
 */
class BlankLineSplitter {
  /**
   * 创建一个BlankLineSplitter实例
   * @param {Object} options - 配置选项
   * @param {number} options.chunkSize - 每个块的最大大小（字符数）
   * @param {number} options.chunkOverlap - 相邻块之间的重叠字符数（在此实现中不使用）
   * @param {string|null} options.chunkHeader - 添加到每个块开头的头部信息
   */
  constructor({ chunkSize, chunkOverlap, chunkHeader = null }) {
    this.log(`Will split by blank lines with max size`, { chunkSize });
    this.chunkSize = chunkSize;
    this.chunkHeader = chunkHeader;
  }

  log(text, ...args) {
    console.log(`\x1b[35m[BlankLineSplitter]\x1b[0m ${text}`, ...args);
  }

  /**
   * 【核心实现】实际执行文本分块的方法
   * ------------------------------------------------
   * 这个方法根据空白行分割文本，并确保每个块不超过最大大小限制
   * 如果一个由空白行分隔的块超过了大小限制，会进一步分割
   * ------------------------------------------------
   * @param {string} documentText - 需要分割的文档文本
   * @returns {Promise<string[]>} - 分割后的文本块数组
   */
  async _splitText(documentText) {
    if (!documentText || documentText.trim() === '') {
      return [];
    }

    // 1. 首先按空白行分割文本
    // 空白行定义为只包含空格、制表符或为空的行
    const blankLineRegex = /\n\s*\n/g;
    let chunks = documentText.split(blankLineRegex);
    
    // 过滤掉空块
    chunks = chunks.filter(chunk => chunk.trim() !== '');
    
    // 2. 处理超过大小限制的块
    const finalChunks = [];
    for (const chunk of chunks) {
      if (chunk.length <= this.chunkSize) {
        finalChunks.push(chunk);
      } else {
        // 如果块超过大小限制，按句子或段落进一步分割
        // 首先尝试按段落分割
        const paragraphs = chunk.split(/\n/);
        let currentChunk = '';
        
        for (const paragraph of paragraphs) {
          if (currentChunk.length + paragraph.length + 1 <= this.chunkSize) {
            // 如果添加这个段落不会超过限制，就添加它
            currentChunk += (currentChunk ? '\n' : '') + paragraph;
          } else {
            // 如果当前块不为空，保存它
            if (currentChunk) {
              finalChunks.push(currentChunk);
            }
            
            // 检查单个段落是否超过大小限制
            if (paragraph.length > this.chunkSize) {
              // 如果单个段落超过限制，按句子分割
              const sentences = paragraph.split(/(?<=[.!?])\s+/);
              currentChunk = '';
              
              for (const sentence of sentences) {
                if (currentChunk.length + sentence.length + 1 <= this.chunkSize) {
                  currentChunk += (currentChunk ? ' ' : '') + sentence;
                } else {
                  // 如果当前块不为空，保存它
                  if (currentChunk) {
                    finalChunks.push(currentChunk);
                  }
                  
                  // 检查单个句子是否超过大小限制
                  if (sentence.length > this.chunkSize) {
                    // 如果单个句子超过限制，按字符分割
                    for (let i = 0; i < sentence.length; i += this.chunkSize) {
                      finalChunks.push(sentence.substring(i, i + this.chunkSize));
                    }
                    currentChunk = '';
                  } else {
                    currentChunk = sentence;
                  }
                }
              }
            } else {
              currentChunk = paragraph;
            }
          }
        }
        
        // 保存最后一个块
        if (currentChunk) {
          finalChunks.push(currentChunk);
        }
      }
    }
    
    // 3. 添加块头部（如果有）
    if (!this.chunkHeader) {
      return finalChunks;
    }
    
    return finalChunks.map(chunk => `${this.chunkHeader}${chunk}`);
  }
}

module.exports = BlankLineSplitter;