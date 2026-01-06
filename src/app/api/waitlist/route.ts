import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Try to find existing user or create new one
    const normalizedEmail = email.toLowerCase().trim()
    const existingUser = await User.findOne({ where: { email: normalizedEmail } })

    if (existingUser) {
      // Update existing user if name is provided
      if (name) {
        existingUser.name = name.trim()
        await existingUser.save()
      }
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'You are already on the waitlist',
          alreadyExists: true,
          user: { email: existingUser.email, name: existingUser.name, createdAt: existingUser.createdAt }
        },
        { status: 200 }
      )
    }

    // Create new user
    const user = await User.create({
      email: normalizedEmail,
      ...(name && { name: name.trim() }),
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully added to waitlist',
        user: { email: user.email, name: user.name, createdAt: user.createdAt }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Waitlist submission error:', error)
    return NextResponse.json(
      { error: 'Failed to add to waitlist. Please try again.' },
      { status: 500 }
    )
  }
}

