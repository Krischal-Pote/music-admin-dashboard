import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../utils/dbConnect";
import { User, IUser } from "../../../models/User";
import { generateToken, comparePassword } from "../../../utils/auth";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { email, password } = await req.json();

  try {
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    const token = generateToken({ id: user._id, role: user.role });
    return NextResponse.json(
      { message: "Login successful", token },
      {
        headers: {
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600;`,
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
