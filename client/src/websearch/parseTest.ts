import { TopicTreeNode } from "./type"

export const parseTest = (input: TopicTreeNode[], prefix: string = ""): string => {
  let result = "";

  for(let i = 0; i < input.length; i++) {
    result += `## ${prefix}${i + 1}. **${input[i].topic}**\n`;
    if (input[i].description) {
      result += `> _${input[i].description}_\n`;
    }
    if (input[i].content) {
      result += `\n${input[i].content}\n`;
    }
    result += "\n";
    result += parseTest(input[i].subTopics, `${prefix}${i + 1}.`);
  }

  return result.trim();
}