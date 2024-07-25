import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export async function callAPi(userIds: string, access_token: string) {
  const result: Array<{ user_id: string, global_id: string, supplier_id: string }> = [];
  const userIdList = userIds.split(',');

  for (const id of userIdList) {
    const url = `https://graph.microsoft.com/beta/users/${id}@us.royalahold.net`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log("suplier", response.data.extension_2ea9d5d4dce241eebc89850ca76d6b8f_supplierID);
      const formattedData = {
        user_id: id,
        global_id: response.data.extension_2ea9d5d4dce241eebc89850ca76d6b8f_GlobalID,
        supplier_id: response.data.extension_2ea9d5d4dce241eebc89850ca76d6b8f_supplierID
        ? response.data.extension_2ea9d5d4dce241eebc89850ca76d6b8f_supplierID.join(',')
        : null,
      };

      result.push(formattedData);
    } catch (e) {
      console.error('Error fetching data for user:', id, e);
    }
  }

  return result;
}
