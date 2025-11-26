/**
 * Utility function to update websiteMaster in MongoDB
 * This file is included in generated GitHub repositories for easy website updates
 * 
 * Usage:
 *   import { updateWebsiteMaster } from './utils/updateWebsiteMaster';
 *   
 *   await updateWebsiteMaster(websiteId, {
 *     pages: [...],
 *     websiteName: "Updated Name",
 *     // ... any other websiteMaster fields
 *   });
 */

export interface UpdateWebsiteMasterOptions {
  /**
   * Whether to send email notification to the client (default: true)
   */
  sendEmailNotification?: boolean;
  
  /**
   * Custom API endpoint URL (default: uses NEXT_PUBLIC_APP_URL or falls back to relative path)
   */
  apiUrl?: string;
}

export interface UpdateWebsiteMasterResult {
  success: boolean;
  message?: string;
  websiteId?: string;
  website?: any;
  error?: string;
}

/**
 * Update websiteMaster in MongoDB via API
 * 
 * @param websiteId - The MongoDB _id of the website to update
 * @param updates - Partial WebsiteMaster object with fields to update
 * @param options - Optional configuration
 * @returns Promise with update result
 * 
 * @example
 * ```typescript
 * const result = await updateWebsiteMaster('507f1f77bcf86cd799439011', {
 *   pages: newPagesArray,
 *   websiteName: 'Updated Website Name',
 *   status: 'in-progress'
 * });
 * 
 * if (result.success) {
 *   console.log('Website updated successfully!');
 * } else {
 *   console.error('Update failed:', result.error);
 * }
 * ```
 */
export async function updateWebsiteMaster(
  websiteId: string,
  updates: Record<string, any>,
  options: UpdateWebsiteMasterOptions = {}
): Promise<UpdateWebsiteMasterResult> {
  const {
    sendEmailNotification = true,
    apiUrl,
  } = options;

  // Determine API URL
  let endpoint = '/api/userActions/update-website';
  if (apiUrl) {
    endpoint = `${apiUrl.replace(/\/$/, '')}/api/userActions/update-website`;
  } else if (typeof window !== 'undefined' && window.location) {
    // Client-side: use current origin
    endpoint = `${window.location.origin}/api/userActions/update-website`;
  } else if (process.env.NEXT_PUBLIC_APP_URL) {
    // Server-side: use environment variable
    endpoint = `${process.env.NEXT_PUBLIC_APP_URL}/api/userActions/update-website`;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        websiteId,
        updates,
        sendEmailNotification,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        websiteId,
      };
    }

    return {
      success: true,
      message: data.message || 'Website updated successfully',
      websiteId: data.websiteId,
      website: data.website,
    };
  } catch (error) {
    console.error('❌ Error updating websiteMaster:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      websiteId,
    };
  }
}

/**
 * Helper function to update websiteMaster from websiteData.json
 * Useful when you have the full websiteMaster object from the repo
 * 
 * @param websiteDataPath - Path to websiteData.json file (default: './src/data/websiteData.json')
 * @param options - Optional configuration
 * @returns Promise with update result
 * 
 * @example
 * ```typescript
 * // Update from websiteData.json in the repo
 * const result = await updateWebsiteMasterFromFile();
 * ```
 */
export async function updateWebsiteMasterFromFile(
  websiteDataPath: string = './src/data/websiteData.json',
  options: UpdateWebsiteMasterOptions = {}
): Promise<UpdateWebsiteMasterResult> {
  try {
    // Read websiteData.json
    const fs = await import('fs/promises');
    const websiteDataContent = await fs.readFile(websiteDataPath, 'utf-8');
    const websiteMaster = JSON.parse(websiteDataContent);

    if (!websiteMaster._id) {
      return {
        success: false,
        error: 'websiteData.json does not contain _id field. Make sure the website has been saved to the database first.',
      };
    }

    // Update using the _id from the file
    return await updateWebsiteMaster(websiteMaster._id, websiteMaster, options);
  } catch (error) {
    console.error('❌ Error reading websiteData.json:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to read websiteData.json',
    };
  }
}

/**
 * Example usage in a Node.js script or button click handler
 * 
 * @example
 * ```typescript
 * // In a script or component
 * import { updateWebsiteMaster } from './utils/updateWebsiteMaster';
 * 
 * // After making changes to your website
 * const result = await updateWebsiteMaster('your-website-id', {
 *   pages: updatedPages,
 *   websiteName: 'New Name',
 * });
 * 
 * if (result.success) {
 *   console.log('✅ Website updated! Client has been notified.');
 * } else {
 *   console.error('❌ Update failed:', result.error);
 * }
 * ```
 */

