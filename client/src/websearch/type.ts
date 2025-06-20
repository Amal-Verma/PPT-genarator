export type TopicTreeNode = {
  topic: string;
  description: string;
  content: string; // New field for generated content
  subTopics: TopicTreeNode[];
};

export type SubTopic = {
  subTopic: string;
  description: string;
  expand: boolean; // Whether to expand this subtopic further
}

export type SearchResult = {
  link: string;
  content: string;
};