import { NextResponse } from "next/server";
import { parse } from "json2csv"; // You can install this package using `npm install json2csv`

export async function GET() {
  // Simulated artist data, replace with your database query
  const artists = [
    { id: 1, name: "Artist 1", genre: "Pop" },
    { id: 2, name: "Artist 2", genre: "Rock" },
    // Add more fields as needed
  ];

  // Define the fields for the CSV file
  const fields = ["id", "name", "genre"];

  // Convert JSON to CSV
  const csv = parse(artists, { fields });

  // Return the CSV as a downloadable file
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=artists.csv",
    },
  });
}
