import {
	Client,
	Databases,
	Users,
	MessagingProviderType,
	ID,
} from "node-appwrite";

import sgMail from "@sendgrid/mail";

const PROJECT_ID = process.env.PROJECT_ID;
const DB_ID = process.env.DB_ID;
const COLLECTION_ID = process.env.COLLECTION_ID;

export default async ({ req, res, log, error }) => {
	log("Received request method:", req.method);

	const client = new Client();

	client.setEndpoint("https://cloud.appwrite.io/v1").setProject(PROJECT_ID);

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

		sgMail.setApiKey(process.env.SENDGRID_KEY);
		log("SendGrid API key set.");

		const msg = {
			to: email,
			from: "amancharlamanas@gmail.com",
			subject: `Welcome ${name}`,
			text: `Welcome ${name}`,
			html: `<p>Welcome ${name}</p>`,
		};

		await sgMail.send(msg);
		log("Email sent successfully.");

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

	// const { email, name, phone } = JSON.parse(req.payload);

	// const db = new Databases(client);

	// if (req.method == "POST") {
	// 	sgMail.setApiKey(process.env.SENDGRID_KEY);

	// 	const msg = {
	// 		to: email,
	// 		from: "amancharlamanas@gmail.com",
	// 		subject: `Welcome ${name}`,
	// 		text: `Welcome ${name}`,
	// 		html: `<p>Welcome ${name}}</p>`,
	// 	};

	// 	try {
	// 		await sgMail.send(msg);
	// 		res.json({ status: "Email sent successfully via SendGrid" });
	// 	} catch (err) {
	// 		console.error("SendGrid error:", err);
	// 		res.json({ status: "Error sending email via SendGrid", error: err });
	// 	}
	// }

	// return res.send(`Expected POST, received ${req.method}`);
};
