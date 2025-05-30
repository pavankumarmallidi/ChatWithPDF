
import { supabase } from '@/integrations/supabase/client';

export interface PdfData {
  id: number;
  created_at: string;
  "EMAIL ID": string;
  "PDF NAME": string;
  "PDF SUMMARY": string;
  "PAGES": number;
  "WORDS": number;
  "LANGUAGE": string;
  "OCR OF PDF": string;
}

/**
 * Inserts PDF data into the PDF_DATA_INFO table
 */
export const insertPdfData = async (
  userEmail: string,
  pdfData: {
    pdfName: string;
    summary: string;
    pages: number;
    words: number;
    language: string;
    ocrText: string;
  }
): Promise<number> => {
  try {
    console.log('Inserting PDF data for:', userEmail, pdfData);
    
    const { data, error } = await supabase
      .from('PDF_DATA_INFO')
      .insert({
        "EMAIL ID": userEmail,
        "PDF NAME": pdfData.pdfName,
        "PDF SUMMARY": pdfData.summary,
        "PAGES": pdfData.pages,
        "WORDS": pdfData.words,
        "LANGUAGE": pdfData.language,
        "OCR OF PDF": pdfData.ocrText
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error inserting PDF data:', error);
      throw error;
    }

    console.log('PDF data inserted with ID:', data.id);
    return data.id;
  } catch (error) {
    console.error('Failed to insert PDF data:', error);
    throw error;
  }
};

/**
 * Fetches all PDFs for a specific user
 */
export const getUserPdfs = async (userEmail: string): Promise<PdfData[]> => {
  try {
    console.log('Fetching PDFs for user:', userEmail);
    
    const { data, error } = await supabase
      .from('PDF_DATA_INFO')
      .select('*')
      .eq('EMAIL ID', userEmail)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user PDFs:', error);
      throw error;
    }

    console.log('Fetched PDFs:', data);
    return data || [];
  } catch (error) {
    console.error('Failed to fetch user PDFs:', error);
    throw error;
  }
};

/**
 * Fetches a specific PDF by ID for a user
 */
export const getPdfById = async (userEmail: string, pdfId: number): Promise<PdfData | null> => {
  try {
    console.log('Fetching PDF by ID:', pdfId, 'for user:', userEmail);
    
    const { data, error } = await supabase
      .from('PDF_DATA_INFO')
      .select('*')
      .eq('id', pdfId)
      .eq('EMAIL ID', userEmail)
      .single();

    if (error) {
      console.error('Error fetching PDF by ID:', error);
      throw error;
    }

    console.log('Fetched PDF:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch PDF by ID:', error);
    throw error;
  }
};

/**
 * Updates PDF data for a specific user
 */
export const updatePdfData = async (
  userEmail: string,
  pdfId: number,
  updateData: Partial<Omit<PdfData, 'id' | 'created_at' | 'EMAIL ID'>>
): Promise<PdfData> => {
  try {
    console.log('Updating PDF data for:', userEmail, pdfId, updateData);
    
    const { data, error } = await supabase
      .from('PDF_DATA_INFO')
      .update(updateData)
      .eq('id', pdfId)
      .eq('EMAIL ID', userEmail)
      .select()
      .single();

    if (error) {
      console.error('Error updating PDF data:', error);
      throw error;
    }

    console.log('PDF data updated:', data);
    return data;
  } catch (error) {
    console.error('Failed to update PDF data:', error);
    throw error;
  }
};

/**
 * Deletes a PDF record for a specific user
 */
export const deletePdf = async (userEmail: string, pdfId: number): Promise<boolean> => {
  try {
    console.log('Deleting PDF:', pdfId, 'for user:', userEmail);
    
    const { error } = await supabase
      .from('PDF_DATA_INFO')
      .delete()
      .eq('id', pdfId)
      .eq('EMAIL ID', userEmail);

    if (error) {
      console.error('Error deleting PDF:', error);
      throw error;
    }

    console.log('PDF deleted successfully');
    return true;
  } catch (error) {
    console.error('Failed to delete PDF:', error);
    throw error;
  }
};

/**
 * Gets PDF count for a user
 */
export const getUserPdfCount = async (userEmail: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('PDF_DATA_INFO')
      .select('*', { count: 'exact', head: true })
      .eq('EMAIL ID', userEmail);

    if (error) {
      console.error('Error getting PDF count:', error);
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error('Failed to get PDF count:', error);
    return 0;
  }
};
