import webpush from "web-push";
import { NextResponse } from "next/server";


const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const privateKey = process.env.VAPID_PRIVATE_KEY!;

webpush.setVapidDetails(
  "mailto:minhajsulmuneeb@gmail.com",
  publicKey,
  privateKey
);


export async function POST(request: Request) {

    const requestbody = await request.json();
    const {subscribers , title , body} = requestbody;
    subscribers.forEach((sub:any) => {
        webpush.sendNotification(
            JSON.parse(sub),
            JSON.stringify({
                title: title,
                body: body,
            })
        );
    });

    return NextResponse.json({ sent: true });
}
