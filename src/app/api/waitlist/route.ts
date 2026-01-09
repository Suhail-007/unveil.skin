import { NextRequest, NextResponse } from 'next/server';
import Waitlist from '@/lib/models/Waitlist';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone, product_interest, source } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Get client information
    const ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined;
    const user_agent = request.headers.get('user-agent') || undefined;

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if already exists
    const existingEntry = await Waitlist.findOne({ where: { email: normalizedEmail } });

    if (existingEntry) {
      // Update existing entry if new info is provided
      const updates: Partial<{ name: string; phone: string; product_interest: string; source: string }> = {};
      if (name && !existingEntry.name) updates.name = name.trim();
      if (phone && !existingEntry.phone) updates.phone = phone.trim();
      if (product_interest) updates.product_interest = product_interest;
      if (source) updates.source = source;

      if (Object.keys(updates).length > 0) {
        await existingEntry.update(updates);
      }

      return NextResponse.json(
        {
          success: true,
          message: 'You are already on the waitlist',
          alreadyExists: true,
          data: {
            email: existingEntry.email,
            name: existingEntry.name,
            status: existingEntry.status,
            created_at: existingEntry.created_at,
          },
        },
        { status: 200 }
      );
    }

    // Create new waitlist entry
    const waitlistEntry = await Waitlist.create({
      email: normalizedEmail,
      name: name?.trim(),
      phone: phone?.trim(),
      product_interest,
      source,
      status: 'pending',
      ip_address,
      user_agent,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully added to waitlist',
        data: {
          email: waitlistEntry.email,
          name: waitlistEntry.name,
          status: waitlistEntry.status,
          created_at: waitlistEntry.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json({ error: 'Failed to join waitlist. Please try again.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: { status?: string } = {};
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Waitlist.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: offset + limit < count,
      },
    });
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 });
  }
}

