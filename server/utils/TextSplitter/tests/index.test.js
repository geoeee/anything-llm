/**
 * TextSplitter单元测试
 * 用于验证文本分块功能的正确性
 */

const { TextSplitter } = require('../index');
const BlankLineSplitter = require('../BlankLineSplitter');
const RecursiveSplitter = require('../RecursiveSplitter');
const assert = require('assert');

// 测试用的示例文本，包含多个空白行分隔的段落
const sampleText = `这是第一段文本。
这是第一段的第二行。

这是第二段文本，与第一段之间有空白行。


这是第三段文本，与第二段之间有两个空白行。
这是很长的一段文本，如果设置了较小的chunkSize，应该会被进一步分割。这是很长的一段文本，如果设置了较小的chunkSize，应该会被进一步分割。这是很长的一段文本，如果设置了较小的chunkSize，应该会被进一步分割。`;

// 测试函数
async function runTests() {
  console.log('开始测试TextSplitter...');
  
  // 测试1: 使用默认配置的BlankLineSplitter
  console.log('\n测试1: 默认配置的BlankLineSplitter');
  const defaultSplitter = new TextSplitter();
  const defaultChunks = await defaultSplitter.splitText(sampleText);
  console.log(`分块数量: ${defaultChunks.length}`);
  console.log('分块内容:');
  defaultChunks.forEach((chunk, i) => console.log(`块${i+1}: ${chunk.substring(0, 50)}...`));
  
  // 验证默认分块器是否正确分割了空白行
  assert(defaultChunks.length >= 3, '默认分块器应该至少产生3个块');
  
  // 测试2: 使用小chunkSize的BlankLineSplitter
  console.log('\n测试2: 小chunkSize的BlankLineSplitter');
  const smallChunkSplitter = new TextSplitter({ chunkSize: 50 });
  const smallChunks = await smallChunkSplitter.splitText(sampleText);
  console.log(`分块数量: ${smallChunks.length}`);
  console.log('分块内容:');
  smallChunks.forEach((chunk, i) => console.log(`块${i+1}: ${chunk}`));
  
  // 验证小chunkSize是否导致更多的分块
  assert(smallChunks.length > defaultChunks.length, '小chunkSize应该产生更多的块');
  smallChunks.forEach(chunk => assert(chunk.length <= 50, '每个块的长度应该不超过chunkSize'));
  
  // 测试3: 使用RecursiveSplitter
  console.log('\n测试3: 使用RecursiveSplitter');
  const recursiveSplitter = new TextSplitter({ useRecursiveSplitter: true, chunkSize: 100 });
  const recursiveChunks = await recursiveSplitter.splitText(sampleText);
  console.log(`分块数量: ${recursiveChunks.length}`);
  console.log('分块内容:');
  recursiveChunks.forEach((chunk, i) => console.log(`块${i+1}: ${chunk.substring(0, 50)}...`));
  
  // 验证RecursiveSplitter是否正常工作
  assert(recursiveChunks.length > 0, 'RecursiveSplitter应该产生至少一个块');
  
  // 测试4: 测试带有元数据头部的分块
  console.log('\n测试4: 带有元数据头部的分块');
  const metadataSplitter = new TextSplitter({
    chunkSize: 100,
    chunkHeaderMeta: {
      sourceDocument: '测试文档',
      source: 'https://example.com'
    }
  });
  const metadataChunks = await metadataSplitter.splitText(sampleText);
  console.log(`分块数量: ${metadataChunks.length}`);
  console.log('分块内容:');
  metadataChunks.forEach((chunk, i) => console.log(`块${i+1}: ${chunk.substring(0, 100)}...`));
  
  // 验证元数据头部是否被正确添加
  metadataChunks.forEach(chunk => {
    assert(chunk.includes('<document_metadata>'), '每个块应该包含元数据头部标记');
    assert(chunk.includes('sourceDocument: 测试文档'), '每个块应该包含源文档元数据');
    assert(chunk.includes('source: https://example.com'), '每个块应该包含来源元数据');
  });
  
  console.log('\n所有测试通过！');
}

// 运行测试
runTests().catch(error => {
  console.error('测试失败:', error);
  process.exit(1);
});