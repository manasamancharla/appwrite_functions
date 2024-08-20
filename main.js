import {
	Client,
	Databases,
	Users,
	MessagingProviderType,
	ID,
	Messaging,
} from "node-appwrite";

import Mailgun from "mailgun-js";

const PROJECT_ID = process.env.PROJECT_ID;
const DB_ID = process.env.DB_ID;
const COLLECTION_ID = process.env.COLLECTION_ID;

export default async ({ req, res, log, error }) => {
	log("Received request method:", req.method);

	const client = new Client();

	client
		.setEndpoint("https://cloud.appwrite.io/v1")
		.setProject(PROJECT_ID)
		.setKey(process.env.SECRET_KEY);

	const users = new Users(client);

	const messaging = new Messaging(client);

	const headers = req.headers;

	if (req.method !== "POST") {
		log("Invalid request method:", req.method);
		return res.json({
			status: "error",
			message: `Expected POST, received ${req.method}`,
		});
	}

	try {
		const { email, name, phone } = JSON.parse(req.payload);
		log("Parsed payload:", { email, name, phone });

		const userId = headers["x-appwrite-user-id"];

		const result = await users.createTarget(
			ID.unique(), // userId
			ID.unique(), // targetId
			MessagingProviderType.Email, // providerType
			"email" // identifier
			// "<PROVIDER_ID>", // providerId (optional)
			// "<NAME>" // name (optional)
		);

		const message = await messaging.createEmail(
			ID.unique(), // messageId
			`Welcome ${name}`, // subject
			"Thank you for signing up!", // content
			[], // topics (optional)
			[], // users (optional)
			[result], // targets (optional)
			[email], // cc (optional)
			[], // bcc (optional)
			false, // draft (optional)
			false, // html (optional)
			"" // scheduledAt (optional)
		);

		return res.json({
			status: "success",
			message: "Email sent successfully via SendGrid",
		});
	} catch (err) {
		log("Error sending email:", err);
		return res.json({
			status: "error",
			message: "Error sending email via SendGrid",
			error: err.message,
		});
	}
};
