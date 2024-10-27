import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const requestObject: GiveTokenRequest = await request.json();
    const responseObject: GiveTokenResponse = {
        status: "failure",
        reason: "not yet implemented",
        targetWallet: requestObject.targetWallet
    };
    return NextResponse.json(
        responseObject,
        { status: 200 }
      );
}
