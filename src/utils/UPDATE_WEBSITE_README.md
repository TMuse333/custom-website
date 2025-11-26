# Update Website Master Utility

This utility allows you to update the websiteMaster object in MongoDB and notify the client when changes are made.

## Quick Start

After making changes to the website, update the websiteMaster:

```typescript
import { updateWebsiteMaster } from './src/utils/updateWebsiteMaster';

// Get the website ID from websiteData.json
const websiteData = require('./src/data/websiteData.json');
const websiteId = websiteData._id;

// Update the websiteMaster with your changes
const result = await updateWebsiteMaster(websiteId, {
  pages: updatedPagesArray,
  websiteName: 'Updated Website Name',
  // ... any other fields you want to update
});

if (result.success) {
  console.log('✅ Website updated! Client has been notified via email.');
} else {
  console.error('❌ Update failed:', result.error);
}
```

## Alternative: Update from websiteData.json

If you've already updated `websiteData.json` in the repo:

```typescript
import { updateWebsiteMasterFromFile } from './src/utils/updateWebsiteMaster';

const result = await updateWebsiteMasterFromFile();
// This will read websiteData.json and update using the _id in the file
```

## Options

You can customize the update behavior:

```typescript
await updateWebsiteMaster(websiteId, updates, {
  sendEmailNotification: true, // Default: true - sends email to client
  apiUrl: 'https://your-app-url.com' // Optional: custom API URL
});
```

## Example: Button in Admin Panel

```typescript
// In a React component or Next.js page
'use client';

import { updateWebsiteMaster } from '@/utils/updateWebsiteMaster';
import websiteData from '@/data/websiteData.json';

async function handleUpdateWebsite() {
  const result = await updateWebsiteMaster(websiteData._id, {
    pages: websiteData.pages, // Use current websiteData
    // ... other updates
  });

  if (result.success) {
    alert('Website updated! Client notified.');
  } else {
    alert(`Update failed: ${result.error}`);
  }
}

// In your JSX:
<button onClick={handleUpdateWebsite}>
  Update Website Master
</button>
```

## Notes

- The client will receive an email notification when updates are made (unless `sendEmailNotification: false`)
- The `updatedAt` timestamp is automatically updated
- Make sure the website has been saved to the database first (has an `_id`)

