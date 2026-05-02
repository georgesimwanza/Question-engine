import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToMongoDb from "@/app/lib/connect";
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectToMongoDb();

    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Logged in successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}