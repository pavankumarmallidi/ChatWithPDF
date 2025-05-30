
/**
 * Service for handling chat messages to webhook
 */
export const sendChatMessage = async (
  message: string,
  pdfId: number
): Promise<any> => {
  const webhookUrl = "https://pavankumarmallidi.app.n8n.cloud/webhook/5221a79c-7222-4245-98ec-01d6b56d20c7";
  
  const payload = {
    message: message,
    pdfId: pdfId
  };

  console.log('Sending chat message:', payload);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.text();
        console.log('Error response body:', errorData);
        if (errorData) {
          try {
            const parsedError = JSON.parse(errorData);
            errorMessage = parsedError.message || errorMessage;
          } catch {
            errorMessage = errorData || errorMessage;
          }
        }
      } catch (parseError) {
        console.log('Could not parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }
    
    const responseData = await response.json();
    console.log('Chat webhook response:', responseData);
    
    return responseData;
  } catch (error) {
    console.error('Chat message failed:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the webhook. Please check if the service is running.');
    }
    throw error;
  }
};
