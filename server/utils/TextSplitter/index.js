/**
 * @typedef {object} DocumentMetadata
 * @property {string} id - eg; "123e4567-e89b-12d3-a456-426614174000"
 * @property {string} url - eg; "file://example.com/index.html"
 * @property {string} title - eg; "example.com/index.html"
 * @property {string} docAuthor - eg; "no author found"
 * @property {string} description - eg; "No description found."
 * @property {string} docSource - eg; "URL link uploaded by the user."
 * @property {string} chunkSource - eg; link://https://example.com
 * @property {string} published - ISO 8601 date string
 * @property {number} wordCount - Number of words in the document
 * @property {string} pageContent - The raw text content of the document
 * @property {number} token_count_estimate - Number of tokens in the document
 */

function isNullOrNaN(value) {
  if (value === null) return true;
  return isNaN(value);
}

class TextSplitter {
  #splitter;
  constructor(config = {}) {
    /*
      config can be a ton of things depending on what is required or optional by the specific splitter.
      Non-splitter related keys
      {
        splitByFilename: string, // TODO
      }
      ------
      Default: "RecursiveCharacterTextSplitter"
      Config: {
        chunkSize: number,
        chunkOverlap: number,
        chunkHeaderMeta: object | null, // Gets appended to top of each chunk as metadata
      }
      ------
    */
    this.config = config;
    this.#splitter = this.#setSplitter(config);
  }

  log(text, ...args) {
    console.log(`\x1b[35m[TextSplitter]\x1b[0m ${text}`, ...args);
  }

  /**
   *  Does a quick check to determine the text chunk length limit.
   * Embedder models have hard-set limits that cannot be exceeded, just like an LLM context
   * so here we want to allow override of the default 1000, but up to the models maximum, which is
   * sometimes user defined.
   */
  /**
   * 【核心功能】确定文本分块的最大尺寸
   * ------------------------------------------------
   * 这个静态方法用于确定文本分块的最大长度，考虑了用户偏好和嵌入模型的限制。
   * 嵌入模型有硬性的长度限制，就像LLM上下文一样，不能超过。
   * ------------------------------------------------
   * @param {number|null} preferred - 用户偏好的块大小
   * @param {number} embedderLimit - 嵌入模型的最大限制，默认为1000
   * @returns {number} - 最终确定的块大小
   */
  static determineMaxChunkSize(preferred = null, embedderLimit = 1000) {
    // 如果preferred为null或NaN，则使用embedderLimit作为默认值
    const prefValue = isNullOrNaN(preferred)
      ? Number(embedderLimit)
      : Number(preferred);
    const limit = Number(embedderLimit);
    // 如果用户偏好的值超过了模型限制，输出警告并使用模型限制
    if (prefValue > limit)
      console.log(
        `\x1b[43m[WARN]\x1b[0m Text splitter chunk length of ${prefValue} exceeds embedder model max of ${embedderLimit}. Will use ${embedderLimit}.`
      );
    return prefValue > limit ? limit : prefValue;
  }

  /**
   *  Creates a string of metadata to be prepended to each chunk.
   * @param {DocumentMetadata} metadata - Metadata to be prepended to each chunk.
   * @returns {{[key: ('title' | 'published' | 'source')]: string}} Object of metadata that will be prepended to each chunk.
   */
  static buildHeaderMeta(metadata = {}) {
    if (!metadata || Object.keys(metadata).length === 0) return null;
    const PLUCK_MAP = {
      title: {
        as: "sourceDocument",
        pluck: (metadata) => {
          return metadata?.title || null;
        },
      },
      published: {
        as: "published",
        pluck: (metadata) => {
          return metadata?.published || null;
        },
      },
      chunkSource: {
        as: "source",
        pluck: (metadata) => {
          const validPrefixes = ["link://", "youtube://"];
          // If the chunkSource is a link or youtube link, we can add the URL
          // as its source in the metadata so the LLM can use it for context.
          // eg prompt: Where did you get this information? -> answer: "from https://example.com"
          if (
            !metadata?.chunkSource || // Exists
            !metadata?.chunkSource.length || // Is not empty
            typeof metadata.chunkSource !== "string" || // Is a string
            !validPrefixes.some(
              (prefix) => metadata.chunkSource.startsWith(prefix) // Has a valid prefix we respect
            )
          )
            return null;

          // We know a prefix is present, so we can split on it and return the rest.
          // If nothing is found, return null and it will not be added to the metadata.
          let source = null;
          for (const prefix of validPrefixes) {
            source = metadata.chunkSource.split(prefix)?.[1] || null;
            if (source) break;
          }

          return source;
        },
      },
    };

    const pluckedData = {};
    Object.entries(PLUCK_MAP).forEach(([key, value]) => {
      if (!(key in metadata)) return; // Skip if the metadata key is not present.
      const pluckedValue = value.pluck(metadata);
      if (!pluckedValue) return; // Skip if the plucked value is null/empty.
      pluckedData[value.as] = pluckedValue;
    });

    return pluckedData;
  }

  /**
   *  Creates a string of metadata to be prepended to each chunk.
   */
  stringifyHeader() {
    if (!this.config.chunkHeaderMeta) return null;
    let content = "";
    Object.entries(this.config.chunkHeaderMeta).map(([key, value]) => {
      if (!key || !value) return;
      content += `${key}: ${value}\n`;
    });

    if (!content) return null;
    return `<document_metadata>\n${content}</document_metadata>\n\n`;
  }

  #setSplitter(config = {}) {
    // 根据配置选择使用空白行分块器或递归分块器
    const BlankLineSplitter = require('./BlankLineSplitter');
    const RecursiveSplitter = require('./RecursiveSplitter');
    const splitterConfig = {
      chunkSize: isNaN(config?.chunkSize) ? 1_000 : Number(config?.chunkSize),
      chunkOverlap: isNaN(config?.chunkOverlap)
        ? 20
        : Number(config?.chunkOverlap),
      chunkHeader: this.stringifyHeader(),
    };

    // 如果指定使用递归分块器，则使用RecursiveSplitter
    if (config?.useRecursiveSplitter) {
      return new RecursiveSplitter(splitterConfig);
    }

    // 默认使用BlankLineSplitter
    return new BlankLineSplitter(splitterConfig);
  }

  /**
   * 【核心功能】分割文本为多个块
   * ------------------------------------------------
   * 这是文本分块的主要入口方法，将文档文本分割成多个小块
   * ------------------------------------------------
   * @param {string} documentText - 需要分割的文档文本
   * @returns {Promise<string[]>} - 分割后的文本块数组
   */
  async splitText(documentText) {
    return this.#splitter._splitText(documentText);
  }
}

module.exports.TextSplitter = TextSplitter;
