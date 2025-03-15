// import { useState, useEffect } from "react";
// import { db } from "../lib/firebase";
// import { collection, query, orderBy, getDocs } from "firebase/firestore";

// export default function Newsletter() {
//   const [entries, setEntries] = useState([]);

//   useEffect(() => {
//     const fetchEntries = async () => {
//       const q = query(collection(db, "entries"), orderBy("createdAt", "desc"));
//       const snapshot = await getDocs(q);
//       setEntries(snapshot.docs.map((doc) => doc.data()));
//     };
//     fetchEntries();
//   }, []);

//   return (
//     <div className="p-4 max-w-lg">
//       <h1 className="text-2xl font-bold mb-4">Monthly Newsletter</h1>
//       {entries.map((entry, index) => (
//         <div key={index} className="p-4 border rounded mb-4">
//           <p>{entry.text}</p>
//           {entry.imageUrl && <img src={entry.imageUrl} alt="Upload" className="mt-2 w-full rounded" />}
//           <p className="text-sm text-gray-500">- {entry.user}</p>
//         </div>
//       ))}
//     </div>
//   );
// }
