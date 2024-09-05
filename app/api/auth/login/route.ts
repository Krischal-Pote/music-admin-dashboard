import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongo";
import { compare } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new NextResponse("Email and password are required", {
        status: 400,
      });
    }

    const client = await clientPromise;
    const db = client.db("music");

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    // Optionally, remove sensitive data before returning the user
    const { password: userPassword, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error during login:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
