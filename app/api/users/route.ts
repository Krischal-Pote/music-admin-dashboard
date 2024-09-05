import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongo";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("music");
    const body = await req.json();

    const { first_name, email, password, phone, dob, gender, role, address } =
      body;

    if (!first_name || !email || !password) {
      return NextResponse.json(
        { error: "First name, email, and password are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    // Create the user document
    const newUser = {
      first_name,
      email,
      password: hashedPassword, // Store hashed password
      ...(phone && { phone }),
      ...(dob && { dob: new Date(dob) }),
      ...(gender && { gender }),
      ...(role && { role }),
      ...(address && { address }),
    };

    // Insert into the database
    const result = await db.collection("users").insertOne(newUser);

    // Respond with the created user (without returning the password)
    const { password: userPassword, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { message: "User created successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
