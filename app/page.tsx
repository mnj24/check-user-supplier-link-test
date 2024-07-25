"use client";
import { useState } from 'react';
import axios from 'axios';
import { callAPi } from './user-supplier-ids';

export default function Home() {
  const [accessToken, setAccessToken] = useState('');
  const [userIds, setUserIds] = useState('');
  const [result, setResult] = useState<Array<{ user_id: string, global_id: string, supplier_id: string }> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const data = await callAPi(userIds, accessToken);
      setResult(data);
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className='h-screen w-full bg-gray-100 flex flex-row'>
      <div className="flex bg-gray-200 flex-col items-center h-full w-1/2 justify-center">
        <h1 className='font-semibold text-gray-800 text-lg my-4'>Check User - Supplier Link</h1>
        <form onSubmit={handleSubmit} className='flex flex-col space-y-10 '>
          <div className='flex flex-col'>
            <label htmlFor="accessToken" className='text-gray-800 text-sm font-semibold'>Access Token:</label>
            <textarea
              className='bg-white text-black'
              onChange={(e) => setAccessToken(e.target.value)}
              required
            />
          </div>
          <div className='flex flex-col '>
            <label htmlFor="userIds" className='text-gray-800 font-semibold text-sm'>User IDs (comma-separated):</label>
            <input
              type="text"
              id="userIds"
              className='bg-white text-black'
              value={userIds}
              onChange={(e) => setUserIds(e.target.value)}
              required
            />
          </div>
          <button type="submit" className='bg-purple-500 rounded-md text-sm p-2'>Submit</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div className='w-1/2'>
        {result && (
          <div>
            <h2 className='text-gray-800 text-lg font-bold text-center'>Results</h2>
            <table className='min-w-full bg-white text-black border border-gray-300'>
              <thead>
                <tr>
                  <th className='py-2 px-4 border-b'>User ID</th>
                  <th className='py-2 px-4 border-b'>Global ID</th>
                  <th className='py-2 px-4 border-b'>Supplier ID</th>
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
        )}
      </div>
    </div>
  );
}
