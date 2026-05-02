export interface Book {
  countOfViews?: number | 0;
  title: string;            
  description?: string | null; 
  authors: string;          
  favorite?: boolean;      
  fileCover?: string | null; 
  fileName?: string | null;  
  fileBook?: string | null;  
}