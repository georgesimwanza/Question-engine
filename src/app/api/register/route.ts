import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToMongoDb from '@/app/lib/connect';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

     console.log('Connecting to MongoDB...'); // ✅ add this
    await connectToMongoDb();
    console.log('Connected!');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });
    
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    console.log({ username, email, password });

    return NextResponse.json(
      { message: 'Registered successfully' },
      { status: 201 }
    );

  } catch (error) {
     console.error('REGISTER ERROR:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }

 
}

 