import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongo";
import { ObjectId } from "mongodb";
import { compare, hash } from "bcryptjs";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const client = await clientPromise;
  const db = client.db("music");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const result = await db
    .collection("users")
    .deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "User deleted successfully" },
    { status: 200 }
  );
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const client = await clientPromise;
  const db = client.db("music");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  const body = await req.json();
  const { first_name, last_name, email, phone, dob, role, address, gender } =
    body;

  const updateData = {
    ...(first_name && { first_name }),
    ...(last_name && { last_name }),
    ...(email && { email }),
    ...(phone && { phone }),
    ...(dob && { dob }),
    ...(role && { role }),
    ...(address && { address }),
    ...(gender && { gender }),
  };

  const result = await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

  if (result.modifiedCount === 0) {
    return NextResponse.json(
      { error: "User not found or not updated" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "User updated successfully" },
    { status: 200 }
  );
}
