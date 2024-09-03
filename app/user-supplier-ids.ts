import { Client } from '@microsoft/microsoft-graph-client';
import { InteractiveBrowserCredential } from '@azure/identity';

// Utility function to call the Microsoft Graph API
export async function callAPi(userIds: string, accessToken: string) {
  const result: Array<{ user_id: string; global_id: string; supplier_id: string }> = [];
  const userIdList = userIds.split(',');

 

  // Create an authenticated client
  const client = Client.init({
    defaultVersion: 'beta',
    authProvider: (done) => {
      done(null, accessToken); // Pass the access token to the client
    },
  });

  for (const id of userIdList) {
    const userId = `${id}@us.royalahold.net`;
    
    try {
      const response = await client.api(`/users/${userId}`).get();
      //const response = await client.api(`/users/manomanoj20@outlook.com`).get();
      //console.log(response);
      //console.log('supplier', response.extension_2ea9d5d4dce241eebc89850ca76d6b8f_supplierID);

      const formattedData = {
        user_id: id,
        global_id: response.extension_2ea9d5d4dce241eebc89850ca76d6b8f_GlobalID,
        supplier_id: response.extension_2ea9d5d4dce241eebc89850ca76d6b8f_supplierID
          ? response.extension_2ea9d5d4dce241eebc89850ca76d6b8f_supplierID.join(',')
          : null,
      };

      result.push(formattedData);
    } catch (e) {
      console.error('Error fetching data for user:', id, e);
    }
  }

  return result;
}