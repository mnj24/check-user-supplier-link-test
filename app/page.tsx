"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { callAPi } from "./user-supplier-ids"; // Adjust path as needed
import * as XLSX from "xlsx"; // Import xlsx library

export default function Home() {
  const [userIds, setUserIds] = useState("");
  const [result, setResult] = useState<
    Array<{ user_id: string; global_id: string; supplier_id: string }> | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // New state for checking if the component has hydrated

  useEffect(() => {
    setIsClient(true); // Set to true after the component mounts on the client
  }, []);

  useEffect(() => {
    // Replace this with Managed Identity logic or client credentials flow
    async function fetchToken() {
      try {
        const response = await fetch(
          "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2019-08-01&resource=https://graph.microsoft.com",
          {
            method: "GET",
            headers: {
              "Metadata": "true",
            },
          }
        );

        if (response.ok) {
          const tokenResponse = await response.json();
          setAccessToken(tokenResponse.access_token); // Set access token
        } else {
          console.error("Error fetching token", response);
        }
      } catch (error) {
        console.error("Error acquiring access token", error);
      }
    }

    fetchToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!accessToken) {
      setError("Access token not available");
      return;
    }

    try {
      const data = await callAPi(userIds, accessToken); // Adjust API call as needed
      setResult(data);
    } catch (err) {
      setError("An error occurred");
    }
  };

  const handleExport = () => {
    if (result) {
      const worksheet = XLSX.utils.json_to_sheet(result);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
      XLSX.writeFile(workbook, "user_supplier_data.xlsx");
    }
  };

  return (
    <div className="h-screen w-full bg-gray-100 flex">
      {/* Left Side */}
      <div className="w-1/2 bg-gray-800 flex flex-col items-center p-4 relative">
        <div className="flex items-end justify-between mt-6">
          <div className="w-48">
            <Image
              src="/ahold_Logo.png"
              alt="Ahold Logo 1"
              width={192}
              height={108}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center flex-grow">
          <h1 className="font-semibold text-white text-lg my-4 text-center">
            Check User - Supplier Link
          </h1>
          {isClient && (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col space-y-10 w-full max-w-md mt-4"
              >
                <div className="flex flex-col">
                  <label
                    htmlFor="userIds"
                    className="text-white font-semibold text-sm"
                  >
                    User IDs (comma-separated):
                  </label>
                  <input
                    type="text"
                    id="userIds"
                    className="bg-white text-black p-2 border rounded"
                    value={userIds}
                    onChange={(e) => setUserIds(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-500 rounded-md text-sm p-2"
                >
                  Submit
                </button>
              </form>
            </>
          )}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
        <div className="absolute bottom-4 right-4">
          <div className="h-6">
            <Image
              src="/MIT Top logo (1).svg"
              alt="MIT Logo"
              width={100}
              height={50}
            />
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 bg-gray-700 p-4 overflow-auto">
        {result && (
          <div className="w-full h-full">
            {/* Flex container for Results and Export button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white-800 text-lg font-bold text-center">
                Results
              </h2>
              <button
                onClick={handleExport}
                className="bg-gray-600 rounded-md text-sm p-2"
              >
                Export to Excel
              </button>
            </div>
            <div className="overflow-y-auto h-full">
              <table className="min-w-full bg-gray text-white border border-black-300">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-center">User ID</th>
                    <th className="py-2 px-4 border-b text-center">
                      Global ID
                    </th>
                    <th className="py-2 px-4 border-b text-center">
                      Supplier ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.map((item) => (
                    <tr key={item.user_id}>
                      <td className="py-2 px-4 border-b text-center">
                        {item.user_id}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {item.global_id}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {item.supplier_id}
                      </td>
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
