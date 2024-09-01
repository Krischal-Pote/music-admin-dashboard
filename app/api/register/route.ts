import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../utils/dbConnect";
import { User, IUser } from "../../../models/User";
import { hashPassword } from "../../../utils/auth";

export async function POST(req: NextRequest) {
  await dbConnect();

  const {
    first_name,
    last_name,
    email,
    password,
    phone,
    dob,
    gender,
    address,
    role,
  } = await req.json();

  try {
    const existingUser: IUser | null = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = new User<IUser>({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
      dob,
      gender,
      address,
      role,
    });

    await user.save();
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
