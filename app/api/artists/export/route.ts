import { NextResponse } from "next/server";
import { parse } from "json2csv";
import clientPromise from "../../../../lib/mongo";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("music");

  const artists = await db.collection("artists").find({}).toArray();

  const fields = [
    "name",
    "dob",
    "gender",
    "address",
    "first_release_year",
    "no_of_albums_released",
  ];

  const csv = parse(
    artists.map((artist) => ({
      name: artist.name,
      dob: artist.dob ? new Date(artist.dob).toLocaleDateString() : "",
      gender: artist.gender,
      address: artist.address || "",
      first_release_year: artist.first_release_year || "",
      no_of_albums_released: artist.no_of_albums_released || "",
    })),
    { fields }
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=artists.csv",
    },
  });
}
