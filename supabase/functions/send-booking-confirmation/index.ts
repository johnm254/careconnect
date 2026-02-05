 import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
 import { Resend } from "resend";
 
 const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
 
 const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Headers":
     "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
 };
 
 interface BookingConfirmationRequest {
   patientName: string;
   patientEmail?: string;
   patientPhone: string;
   doctorName: string;
   department: string;
   date: string;
   time: string;
   bookingRef: string;
   reason?: string;
 }
 
 const handler = async (req: Request): Promise<Response> => {
   // Handle CORS preflight requests
   if (req.method === "OPTIONS") {
     return new Response(null, { headers: corsHeaders });
   }
 
   try {
     const {
       patientName,
       patientEmail,
       patientPhone,
       doctorName,
       department,
       date,
       time,
       bookingRef,
       reason,
     }: BookingConfirmationRequest = await req.json();
 
     console.log("Received booking confirmation request:", {
       patientName,
       patientEmail,
       patientPhone,
       doctorName,
       department,
       date,
       time,
       bookingRef,
     });
 
     // Validate required fields
     if (!patientName || !doctorName || !date || !time || !bookingRef) {
       throw new Error("Missing required fields");
     }
 
     const responses: { email?: any; sms?: string } = {};
 
     // Send email confirmation if email is provided
     if (patientEmail) {
       console.log("Sending email confirmation to:", patientEmail);
       
       const emailResponse = await resend.emails.send({
         from: "Hospital Booking <onboarding@resend.dev>",
         to: [patientEmail],
         subject: `Booking Confirmation - ${bookingRef}`,
         html: `
           <!DOCTYPE html>
           <html>
           <head>
             <meta charset="utf-8">
             <meta name="viewport" content="width=device-width, initial-scale=1.0">
           </head>
           <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
             <div style="background-color: white; border-radius: 8px; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
               <div style="text-align: center; margin-bottom: 24px;">
                 <div style="width: 64px; height: 64px; background-color: #22c55e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                   <span style="color: white; font-size: 32px;">✓</span>
                 </div>
               </div>
               
               <h1 style="color: #1a1a1a; font-size: 24px; text-align: center; margin-bottom: 8px;">
                 Booking Confirmed!
               </h1>
               
               <p style="color: #666; text-align: center; margin-bottom: 24px;">
                 Your consultation has been successfully scheduled.
               </p>
               
               <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                 <table style="width: 100%; border-collapse: collapse;">
                   <tr>
                     <td style="padding: 8px 0; color: #666;">Reference:</td>
                     <td style="padding: 8px 0; text-align: right; font-weight: 600; color: #1a1a1a;">${bookingRef}</td>
                   </tr>
                   <tr>
                     <td style="padding: 8px 0; color: #666;">Patient:</td>
                     <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${patientName}</td>
                   </tr>
                   <tr>
                     <td style="padding: 8px 0; color: #666;">Doctor:</td>
                     <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${doctorName}</td>
                   </tr>
                   <tr>
                     <td style="padding: 8px 0; color: #666;">Department:</td>
                     <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${department}</td>
                   </tr>
                   <tr>
                     <td style="padding: 8px 0; color: #666;">Date:</td>
                     <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${date}</td>
                   </tr>
                   <tr>
                     <td style="padding: 8px 0; color: #666;">Time:</td>
                     <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${time}</td>
                   </tr>
                   ${reason ? `
                   <tr>
                     <td style="padding: 8px 0; color: #666;">Reason:</td>
                     <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${reason}</td>
                   </tr>
                   ` : ''}
                 </table>
               </div>
               
               <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                 <p style="color: #92400e; margin: 0; font-size: 14px;">
                   <strong>Important:</strong> Please arrive 15 minutes before your appointment time. 
                   Bring any relevant medical records and a valid ID.
                 </p>
               </div>
               
               <p style="color: #666; font-size: 12px; text-align: center; margin-top: 24px;">
                 If you need to cancel or reschedule, please contact us at least 24 hours in advance.
               </p>
             </div>
           </body>
           </html>
         `,
       });
 
       console.log("Email sent successfully:", emailResponse);
       responses.email = emailResponse;
     }
 
     // SMS confirmation would go here if Twilio or similar is configured
     // For now, we'll just log the SMS details
     if (patientPhone) {
       console.log("SMS confirmation would be sent to:", patientPhone);
       responses.sms = `SMS would be sent to ${patientPhone}`;
     }
 
     return new Response(JSON.stringify({ success: true, ...responses }), {
       status: 200,
       headers: {
         "Content-Type": "application/json",
         ...corsHeaders,
       },
     });
   } catch (error: any) {
     console.error("Error in send-booking-confirmation function:", error);
     return new Response(
       JSON.stringify({ error: error.message }),
       {
         status: 500,
         headers: { "Content-Type": "application/json", ...corsHeaders },
       }
     );
   }
 };
 
 serve(handler);