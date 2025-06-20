import { getSubTopics } from "./getSubTopics";
import { generateContent } from "./generateContent";

import { TopicTreeNode } from "./type";

const MAX_DEPTH = 5; // Maximum depth to prevent excessive recursion
const MIN_TOPICS = 3; // Minimum number of topics to fetch

// Async generator version for streaming topic tree with path
export async function* getTopicTreeStream(
  mainPrompt: string,
  query: string,
  numResults: number = 5,
  maxDepth: number = 3,
  breath: number = 2
): AsyncGenerator<{ node: TopicTreeNode; path: number[] }, void, unknown> {
  // Recursive helper generator for subtopics
  async function* helper(
    mainPrompt: string,
    query: string,
    numResults: number,
    depth: number,
    path: number[],
    breath: number
  ): AsyncGenerator<{ node: TopicTreeNode; path: number[] }, void, unknown> {
    numResults = Math.max(numResults, MIN_TOPICS);
    depth = Math.min(depth, MAX_DEPTH);
    if (depth === 0) return;

    // Get subtopics for this node
    const subTopics = await getSubTopics(mainPrompt, query, numResults);
    for (let i = 0; i < subTopics.length; i++) {
      const subTopic = subTopics[i];
      // Generate content for this subtopic
      const content = await generateContent(
        subTopic.subTopic,
        subTopic.description,
        breath
      );
      // Create the node
      const node: TopicTreeNode = {
        topic: subTopic.subTopic,
        description: subTopic.description,
        content,
        subTopics: [],
      };
      // Yield the node with its path in the tree
      yield { node, path: [...path, i] };
      // Recursively yield subnodes
      if (subTopic.expand){
        await new Promise(resolve => setTimeout(resolve, 1000)); // Throttle to avoid rate limits
        for await (const sub of helper(
          mainPrompt,
          `Topic: ${subTopic.subTopic}\nDescription: ${subTopic.description}`,
          numResults,
          depth - 1,
          [...path, i],
          breath
        )) {
          yield sub;
        }
      }
    }
  }

  // Generate content for the root node
  const rootContent = await generateContent(query, "", breath);
  const root: TopicTreeNode = {
    topic: query,
    description: "",
    content: rootContent,
    subTopics: [],
  };
  // Yield the root node at path []
  yield { node: root, path: [] };
  // Yield all subnodes recursively
  for await (const sub of helper(mainPrompt, query, numResults, maxDepth, [], breath)) {
    yield sub;
  }
}
