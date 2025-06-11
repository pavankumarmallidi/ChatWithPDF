
/**
 * Service for handling PDF uploads to n8n webhook
 */
export const uploadToWebhook = async (
  file: File,
  userEmail: string,
  onProgress: (progress: number) => void
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('userEmail', userEmail);

    const webhookUrl = "https://pavan.every-ai.com/webhook-test/receive-pdf";

    fetch(webhookUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(async response => {
      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        } catch {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      
      const responseData = await response.json();
      console.log('Webhook response:', responseData);
      
      onProgress(100);
      resolve(responseData);
    })
    .catch(reject);

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 5;
      if (progress <= 95) {
        onProgress(progress);
      } else {
        clearInterval(progressInterval);
      }
    }, 100);
  });
};
