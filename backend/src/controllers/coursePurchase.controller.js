import Stripe from "stripe"
import { Course } from "../models/course.model.js"
import { coursePurchase } from "../models/coursePurchase.model.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user._id
    const { courseId } = req.body   // ✅ fix destructuring

    // 1. Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ success: false, message: "Course does not exist" })
    }

    // 2. Create a record for purchase (status = pending for now)
    const newCoursePurchase = await coursePurchase.create({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending"
    })

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr", // or "inr" if supported
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
              description: course.subTitle,
            },
            unit_amount: course.coursePrice * 100, // Stripe takes amount in cents(paise)
          },
          quantity: 1,
        },
      ],
      metadata: {
        courseId: courseId,
        userId: userId,
        coursePurchaseId: newCoursePurchase._id.toString(),
      },
      success_url: `${process.env.FRONTEND_URL}/course-progress/${courseId}`,
      cancel_url: `${process.env.FRONTEND_URL}/course-detail/${courseId}`,
      shipping_address_collection: {
        allowed_countries: ["IN"]
      }
    })

    if(!session.url) {
        return res.status(400).json({ success: false, message: "Error while creating session" })
    }

    newCoursePurchase.paymentId = session.id
    await newCoursePurchase.save()

    return res.status(200).json({ success: true, url: session.url })
  } 
  catch (error) {
    console.error("Stripe session error:", error)
    return res.status(500).json({ success: false, message: "Failed to create session" })
  }
}


// // controllers/stripe.controller.js
// import Stripe from "stripe";
// import { coursePurchase } from "../models/coursePurchase.model.js";
// import { Lecture } from "../models/lecture.model.js";
// import { User } from "../models/user.model.js";
// import { Course } from "../models/course.model.js";


export const stripeWebhook = async (req, res) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET || process.env.WEBHOOK_ENDPOINT_SECRET;
  let event;

  try {
    // Stripe requires the raw body for signature verification
    const payloadBuffer = req.body;
    const payloadString =
      typeof payloadBuffer === "string" ? payloadBuffer : payloadBuffer.toString("utf8");

    const sigHeader = req.headers["stripe-signature"];

    // If there's no signature header (e.g. you're POSTing manually for local testing),
    // generate a test header string. NOTE: generateTestHeaderString is ONLY for local/dev testing.
    if (!sigHeader) {
      const testHeader = stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret,
      });
      event = stripe.webhooks.constructEvent(payloadString, testHeader, secret);
    } else {
      // For real Stripe events, verify using the raw buffer and header
      event = stripe.webhooks.constructEvent(payloadBuffer, sigHeader, secret);
    }
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // Handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      // Find the purchase by the identifier you stored (snippet used paymentIntentId: session.id)
      // Adjust query if you used metadata.coursePurchaseId instead.
      const purchase = await coursePurchase
        .findOne({ paymentIntentId: session.id })
        .populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      // Update amount if available
      if (session.amount_total) {
        purchase.amount = session.amount_total / 100; // convert cents to currency unit
      }

      // Mark purchase completed
      purchase.status = "completed";

      // Make all lectures visible (isPreviewFree = true) if the course has lectures
      if (purchase.courseId && purchase.courseId.lectures && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      // Save purchase
      await purchase.save();

      // Add course to user's enrolledCourses (use $addToSet so duplicates aren't added)
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } },
        { new: true }
      );

      // Add user to course's enrolledStudents
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } },
        { new: true }
      );
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    // Optionally handle other events or log them
    console.log(`Unhandled event type: ${event.type}`);
  }

  // Acknowledge receipt of the event
  res.status(200).send();
};
