export enum ContentType {
  TEXT = 'TEXT',
  LIST = 'LIST',
  EXERCISE = 'EXERCISE',
  QUOTE = 'QUOTE',
  SUBHEADER = 'SUBHEADER',
  CHECKLIST = 'CHECKLIST',
  INPUT_LIST = 'INPUT_LIST'
}

export interface ContentBlock {
  type: ContentType;
  content: string | string[]; // String for text, array for lists
  id?: string; // For saving exercise state
  placeholder?: string; // For exercise inputs
  label?: string; // Specific label for input fields
  inputType?: 'text' | 'textarea'; // To distinguish between single line and multiline inputs in lists
  maxSelections?: number; // Limit number of checkboxes that can be selected
  minSelections?: number; // Require a minimum number of selections
  isOptional?: boolean; // To mark an exercise as not required for completion
}

export interface Chapter {
  id: string;
  title: string;
  subtitle?: string;
  imagePrompt?: string;
  blocks: ContentBlock[];
}

export interface UserProgress {
  [key: string]: string | boolean | string[]; // Stores exercise answers or checklist completion
}