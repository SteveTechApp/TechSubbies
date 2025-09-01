// This is a mock service to simulate API calls to an e-signature provider
// like DocuSign or HelloSign. In a real application, this would contain
// actual API integration logic.

export const eSignatureService = {
  /**
   * Simulates creating a signature request and sending it to the recipient.
   * @param {string} contractId - The ID of the contract being sent.
   * @param {string} recipientEmail - The email of the person who needs to sign.
   * @returns {Promise<{success: boolean, requestId: string}>} A promise that resolves with a success status.
   */
  createSignatureRequest: async (contractId: string, recipientEmail: string): Promise<{success: boolean, requestId: string}> => {
    console.log(`[eSignatureService] Creating signature request for contract ${contractId} to ${recipientEmail}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`[eSignatureService] Request successful.`);
    return {
      success: true,
      requestId: `sig_req_${Math.random().toString(36).substring(2, 10)}`,
    };
  },

  /**
   * Simulates checking the status of an existing signature request.
   * @param {string} requestId - The ID of the signature request to check.
   * @returns {Promise<{status: string}>} A promise that resolves with the status.
   */
  getSignatureRequestStatus: async (requestId: string): Promise<{status: string}> => {
    console.log(`[eSignatureService] Checking status for request ${requestId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return { status: 'completed' }; // Assume it's always completed for this mock
  },
};