import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongo";
import { compare } from "bcryptjs";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
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

    // Optionally, you can remove sensitive data before returning the user
    const { password: userPassword, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error during login:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const client = await clientPromise;
//   const db = client.db("music");

//   switch (req.method) {
//     case "GET":
//       try {
//         const users = await db.collection("users").find({});
//         console.log("line 51", users);
//         res.status(200).json(users);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//       break;

//     case "POST":
//       try {
//         const newUser = req.body;

//         const result = await db.collection("users").insertOne(newUser);

//         const createdUser = await db
//           .collection("users")
//           .findOne({ _id: new ObjectId(result.insertedId) });

//         res.status(201).json(createdUser);
//       } catch (error) {
//         console.error("Error creating user:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       }
//       break;

//     default:
//       res.setHeader("Allow", ["GET", "POST"]);
//       res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
