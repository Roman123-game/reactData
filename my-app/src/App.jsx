import { useState } from "react";
import ChristmasTree from "./components/Christams/Christmas";

export default function App() {
  // const [string1, setString1] = useState("");
  // const [string2, setString2] = useState("");
  // const [response, setResponse] = useState(null);
  // const [mongoData, setMongoData] = useState(null); // State to store fetched MongoDB data
  const [congrats, setCongrats] = useState("С новым годом! 🎉🎄");
  // const handleSubmit = async (e) => {
  //   const string1 = "Hello";
  //   const string2 = "World";
  //   e.preventDefault();
  //   try {
  //     const res = await fetch("https://server-production-7756.up.railway.app/addData", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ string1, string2 }),
  //     });

  //     if (!res.ok) {
  //       throw new Error(`HTTP error! Status: ${res.status}`);
  //     }

  //     const text = await res.text(); // Get response as text
  //     const data = text ? JSON.parse(text) : { message: "No response from server" }; // Parse only if not empty

  //     setResponse(data.message);
  //   } catch (error) {
  //     console.error("Error sending data:", error);
  //     setResponse("Failed to send data");
  //   }
  // };

  // // Fetch MongoDB data on button click
  // const fetchMongoData = async () => {
  //   try {
  //     const res = await fetch("https://server-production-7756.up.railway.app/getData");
  //     if (!res.ok) {
  //       throw new Error(`HTTP error! Status: ${res.status}`);
  //     }

  //     const data = await res.json();
  //     setMongoData(data); // Store the fetched data
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setMongoData("Failed to fetch data");
  //   }
  // };

  return (
    <div className="main">
      {congrats}
      <ChristmasTree />
    </div>
  );
}

//   return (
//     <div className="p-4 max-w-md mx-auto">

//       <h1 className="text-xl font-bold mb-4">Send Strings to Localhost</h1>
//           <ChristmasTree/>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-2">
//         <input
//           type="text"
//           value={string1}
//           onChange={(e) => setString1(e.target.value)}
//           placeholder="Enter first string"
//           className="p-2 border rounded"
//         />
//         <input
//           type="text"
//           value={string2}
//           onChange={(e) => setString2(e.target.value)}
//           placeholder="Enter second string"
//           className="p-2 border rounded"
//         />
//         <button type="submit" className="p-2 bg-blue-500 text-white rounded">
//           Send
//         </button>
//       </form>

//       {response && <p className="mt-4 text-green-500">{response}</p>}

//       <button
//         onClick={fetchMongoData}
//         className="mt-4 p-2 bg-green-500 text-white rounded"
//       >
//         Fetch Data from MongoDB
//       </button>

//       {mongoData && (
//         <div className="mt-4 p-2 border rounded bg-gray-100">
//           <h2 className="font-semibold">Fetched Data:</h2>
//           <pre>{JSON.stringify(mongoData, null, 2)}</pre> {/* Display MongoDB data */}
//         </div>
//       )}
//     </div>
//   );
// }