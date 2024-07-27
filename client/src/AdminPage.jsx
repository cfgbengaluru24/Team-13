//AdminPage.tsx

import axios from "axios";
import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function AdminPage() {
  const [newData, setNewData] = useState([]);

  const onChange = (e) => {
    const [file] = e.target.files;
    const reader = new FileReader();

    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      console.log(data);
      const DataNew = data.slice(1); // Skip header row

      try {
        // Send the data to the server
        await axios.post("http://localhost:4000/excel", { newData: DataNew });
        alert("Excel data uploaded and users registered successfully");
      } catch (err) {
        console.error("Error uploading data:", err);
        alert("Error uploading data: " + err.message);
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input type="file" onChange={onChange} />
    </div>
  );
}