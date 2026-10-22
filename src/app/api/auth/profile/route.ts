import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuth } from '@/lib/auth';
import { AuthService } from '@/services/auth/authService';
import { prisma } from '@/lib/prisma';
import { normalizeTimezone } from '@/lib/timezone';

export async function GET(req: NextRequest) {
  try {
    const auth = await getRequestAuth(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: auth.user.id },
    });

    return NextResponse.json({
      user: {
        id: auth.user.id,
        email: auth.user.email,
        name: auth.user.name,
        username: auth.user.username,
        timezone: auth.user.timezone,
      },
      profile,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getRequestAuth(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, displayName, bio, avatarUrl, timezone } = await req.json();

    const updateUserData: any = {};
    const updateProfileData: any = {};

    if (timezone) {
      updateUserData.timezone = normalizeTimezone(timezone);
    }

    if (username && username !== auth.user.username) {
      if (!AuthService.isValidUsername(username)) {
        return NextResponse.json(
          { error: 'Username must be 3-30 characters (letters, numbers, underscores, hyphens).' },
          { status: 400 }
        );
      }

      const available = await AuthService.isUsernameAvailable(username, auth.user.id);
      if (!available) {
        return NextResponse.json(
          { error: `Username "${username}" is already taken.` },
          { status: 409 }
        );
      }

      updateUserData.username = username;
      updateUserData.normalizedUsername = AuthService.normalizeUsername(username);
      updateProfileData.username = username;
      updateProfileData.normalizedUsername = AuthService.normalizeUsername(username);
    }

    if (displayName !== undefined) {
      updateProfileData.displayName = displayName;
      updateUserData.name = displayName || auth.user.name;
    }
    if (bio !== undefined) updateProfileData.bio = bio;
    if (avatarUrl !== undefined) updateProfileData.avatarUrl = avatarUrl;

    const [updatedUser, updatedProfile] = await prisma.$transaction([
      prisma.user.update({
        where: { id: auth.user.id },
        data: updateUserData,
      }),
      prisma.profile.upsert({
        where: { userId: auth.user.id },
        create: {
          userId: auth.user.id,
          username: updateUserData.username || auth.user.username || 'user',
          normalizedUsername:
            updateUserData.normalizedUsername ||
            auth.user.normalizedUsername ||
            'user',
          displayName: updateProfileData.displayName || auth.user.name,
          bio: updateProfileData.bio || null,
          avatarUrl: updateProfileData.avatarUrl || null,
        },
        update: updateProfileData,
      }),
    ]);

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        name: updatedUser.name,
        timezone: updatedUser.timezone,
      },
      profile: updatedProfile,
    });
  } catch (error: any) {
    const status = error.message?.includes('Unique constraint') ? 409 : 500;
    return NextResponse.json(
      { error: status === 409 ? 'Username is already taken.' : error.message || 'Update failed.' },
      { status }
    );
  }
}
