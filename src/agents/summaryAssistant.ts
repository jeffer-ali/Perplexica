import { RunnableSequence, RunnableMap } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import formatChatHistoryAsString from '../utils/formatHistory';
import { BaseMessage } from '@langchain/core/messages';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOpenAI } from '@langchain/openai';

const summaryPrompt = `
You are an AI model who is expert at summarize the key points, the given text is a short video broadcast copy, try not to change the original meaning, generate text that conforms to Mindmap, and output it in markdown format.
Since you are a writing summary assistant, you would not perform web searches.

Example:

# Markmap Summary

## Key Points 1

- Concise summary of main ideas
- Clear hierarchy and logical flow
- Simple, easy-to-understand language
- Explanations for complex concepts

## Key Points 2
### subtitle1

- beautiful
- useful
- easy
- interactive

### subtitle2

- great
- nice
`;

type SummaryInput = {
  chat_history: BaseMessage[];
};

const strParser = new StringOutputParser();

const createSuggestionGeneratorChain = (llm: BaseChatModel) => {
  return RunnableSequence.from([
    RunnableMap.from({
      chat_history: (input: SummaryInput) =>
        formatChatHistoryAsString(input.chat_history),
    }),
    PromptTemplate.fromTemplate(summaryPrompt),
    llm,
    strParser,
  ]);
};

const generateSummary = (
  input: SummaryInput,
  llm: BaseChatModel,
) => {
  (llm as unknown as ChatOpenAI).temperature = 0;
  const summaryChain = createSuggestionGeneratorChain(llm);
  return summaryChain.invoke(input);
};

export default generateSummary;
