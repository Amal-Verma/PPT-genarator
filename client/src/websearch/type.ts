export type TopicTreeNode = {
  topic: string;
  description: string;
  content: string; // New field for generated content
  subTopics: TopicTreeNode[];
  webSearch: boolean;
};

export type SubTopic = {
  subTopic: string;
  description: string;
  expand: boolean; // Whether to expand this subtopic further
  webSearch: boolean; // Whether to perform web search for this subtopic
}

export type SearchResult = {
  link: string;
  content: string;
};