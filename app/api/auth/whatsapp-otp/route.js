import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const otpStorage = new Map(); // In production, use Redis or a database

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { phoneNumber, action, otp } = body;
        
        if (action === 'send') {
            const otp = generateOTP();
            otpStorage.set(phoneNumber, otp);

            // Send WhatsApp message using Twilio
            await client.messages.create({
                body: `Kode OTP untuk login: ${otp}`,
                from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                to: `whatsapp:${phoneNumber}`
            });

            return NextResponse.json({ 
                success: true, 
                message: 'OTP telah dikirim ke WhatsApp Anda' 
            });
        } 
        else if (action === 'verify') {
            const storedOTP = otpStorage.get(phoneNumber);

            if (!storedOTP) {
                return NextResponse.json({ 
                    success: false, 
                    message: 'OTP telah kadaluarsa' 
                }, { status: 400 });
            }

            if (otp === storedOTP) {
                otpStorage.delete(phoneNumber); // Clear used OTP
                return NextResponse.json({ 
                    success: true, 
                    message: 'OTP terverifikasi',
                    user: {
                        phoneNumber,
                        role: 'user' // You might want to fetch this from your database
                    }
                });
            }

            return NextResponse.json({ 
                success: false, 
                message: 'OTP tidak valid' 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            success: false, 
            message: 'Action tidak valid' 
        }, { status: 400 });

    } catch (error) {
        console.error('WhatsApp OTP error:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Terjadi kesalahan saat memproses OTP' 
        }, { status: 500 });
    }
}
