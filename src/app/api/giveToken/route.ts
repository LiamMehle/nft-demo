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
// (req: http.IncomingMessage, res: http.ServerResponse): void {
//     const requestObject: GiveTokenRequest = JSON.parse(req.read())
//     const responseObject: GiveTokenResponse = {
//         status: "failure",
//         reason: "not yet implemented",
//         targetWallet: requestObject.targetWallet
//     };
//     res.end(JSON.stringify(responseObject))
// }