export interface category {
  name: string;
  $id: string;
}

export interface project {
  title: string;
  description: string;
  image: string;
  DemoLink?: string;
  githubLink?: string;
  categories?: string[];
  Technologies?: string[];
}

export interface Experience {
  title: string;
  arabicTitle: string;
  description: string;
  arabicDescription: string;
  link?: string;
  titleLink?: string;
  arabicTitleLink?: string;
  motion: number;
  duration: number;
}
