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
	const { email, name, phone } = JSON.parse(req.payload);
	const client = new Client();

	client.setEndpoint("https://cloud.appwrite.io/v1").setProject(PROJECT_ID);

	const db = new Databases(client);

	if (req.method == "POST") {
		sgMail.setApiKey(process.env.SENDGRID_KEY);

		const msg = {
			to: email,
			from: "amancharlamanas@gmail.com",
			subject: `Welcome ${name}`,
			text: `Welcome ${name}`,
			html: `<p>Welcome ${name}}</p>`,
		};

		try {
			await sgMail.send(msg);
			res.json({ status: "Email sent successfully via SendGrid" });
		} catch (err) {
			console.error("SendGrid error:", err);
			res.json({ status: "Error sending email via SendGrid", error: err });
		}

		return res.json({ message: "Done" });
	}

	return res.send(`Expected POST, received ${req.method}`);
};
