const core = require('@actions/core');
const axios = require('axios');

(async () => {
  try {
    const oauthUrl = core.getInput('oauth_url');
    const base64Auth = core.getInput('base64_auth');

    const response = await axios.post(
      oauthUrl,
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${base64Auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const accessToken = response.data.access_token;
    if (!accessToken) throw new Error("No access_token found in response.");

    console.log(`Access Token: ${accessToken}`);
    
    // Set the access token as a GitHub Environment Variable
    core.exportVariable('SAP_ACCESS_TOKEN', accessToken);
    
    // Also return as output if needed
    core.setOutput("access_token", accessToken);
    
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
})();
