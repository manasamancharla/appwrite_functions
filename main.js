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
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

export default async ({ req, res, log, error }) => {
	context.log("Received request method:", req.method);

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

		const mg = Mailgun({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN });

		const data = {
			from: "Your Company <no-reply@yourdomain.com>",
			to: email,
			subject: `Welcome ${name}`,
			text: "Thank you for signing up!",
		};

		mg.messages().send(data, (error, body) => {
			if (error) {
				log("Error sending email:", error);
				return res.json({
					status: "error",
					message: "Error sending email via Mailgun",
					error: error.message,
				});
			} else {
				log("Email sent:", body);
				return res.json({
					status: "success",
					message: "Email sent successfully via Mailgun",
				});
			}
		});
	} catch (err) {
		log("Error processing request:", err);
		return res.json({
			status: "error",
			message: "Error processing request",
			error: err.message,
		});
	}
};
