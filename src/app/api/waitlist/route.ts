import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // Try to create user, or return existing if already in waitlist
    try {
      const user = await prisma.user.upsert({
        where: { email },
        update: {
          updatedAt: new Date(),
          ...(name && { name }),
        },
        create: {
          email: email.toLowerCase().trim(),
          ...(name && { name: name.trim() }),
        },
      })

      return NextResponse.json(
        { 
          success: true, 
          message: 'Successfully added to waitlist',
          user: { email: user.email, name: user.name, createdAt: user.createdAt }
        },
        { status: 200 }
      )
    } catch (error: any) {
      // Handle unique constraint violation (email already exists)
      if (error.code === 'P2002') {
        return NextResponse.json(
          { 
            success: true, 
            message: 'You are already on the waitlist',
            alreadyExists: true
          },
          { status: 200 }
        )
      }
      throw error
    }
  } catch (error) {
    console.error('Waitlist submission error:', error)
    return NextResponse.json(
      { error: 'Failed to add to waitlist. Please try again.' },
      { status: 500 }
    )
  }
}

