"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { callAPi } from './user-supplier-ids';

export default function Home() {
  const { instance, accounts } = useMsal();
  const [userIds, setUserIds] = useState('');
  const [result, setResult] = useState<Array<{ user_id: string, global_id: string, supplier_id: string }> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const getAccessToken = async () => {
      if (accounts.length > 0) {
        try {
          const accessTokenResponse = await instance.acquireTokenSilent({
            scopes: ['User.Read', 'User.Read.All'],
            account: accounts[0],
          });
          console.log('Access Token:', accessTokenResponse.accessToken);
          setAccessToken(accessTokenResponse.accessToken);
        } catch (e) {
          console.error('Error acquiring access token silently:', e);
          setError('Failed to acquire access token');
        }
      }
    };
  
    getAccessToken();
  }, [instance, accounts]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (accessToken) {
      try {
        const data = await callAPi(userIds, accessToken);
        setResult(data);
      } catch (err) {
        setError('An error occurred');
      }
    } else {
      setError('Access token is not available');
    }
  };

  return (
    <div className='h-screen w-full bg-gray-100 flex'>
      {/* Left Side */}
      <div className='w-1/2 bg-gray-800 flex flex-col items-center p-4 relative'>
        <div className="flex items-center justify-center mt-6">
          <div className="w-48">
            <Image src="/ahold_Logo.png" alt="Ahold Logo 1" width={192} height={108} />
          </div>
        </div>
        <div className='flex flex-col items-center justify-center flex-grow'>
          <h1 className='font-semibold text-white text-lg my-4 text-center'>Check User - Supplier Link</h1>
          <form onSubmit={handleSubmit} className='flex flex-col space-y-10 w-full max-w-md'>
            <div className='flex flex-col'>
              <label htmlFor="userIds" className='text-white font-semibold text-sm'>User IDs (comma-separated):</label>
              <input
                type="text"
                id="userIds"
                className='bg-white text-black p-2 border rounded'
                value={userIds}
                onChange={(e) => setUserIds(e.target.value)}
                required
              />
            </div>
            <button type="submit" className='bg-green-500 rounded-md text-sm p-2'>Submit</button>
          </form>
          {error && <p className='text-red-500 mt-4'>{error}</p>}
        </div>
        <div className='absolute bottom-4 right-4'>
          <div className='h-6'>
            <Image src="/MIT Top logo (1).svg" alt="MIT Logo" width={24} height={24} />
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1 bg-gray-700 p-4 overflow-auto'>
        {result && (
          <div className='w-full h-full'>
            <h2 className='text-white-800 text-lg font-bold text-center mb-4'>Results</h2>
            <div className='overflow-y-auto h-full'>
              <table className='min-w-full bg-gray text-white border border-black-300'>
                <thead>
                  <tr>
                    <th className='py-2 px-4 border-b text-center'>User ID</th>
                    <th className='py-2 px-4 border-b text-center'>Global ID</th>
                    <th className='py-2 px-4 border-b text-center'>Supplier ID</th>
                  </tr>
                </thead>
                <tbody>
                  {result.map((item) => (
                    <tr key={item.user_id}>
                      <td className='py-2 px-4 border-b text-center'>{item.user_id}</td>
                      <td className='py-2 px-4 border-b text-center'>{item.global_id}</td>
                      <td className='py-2 px-4 border-b text-center'>{item.supplier_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}