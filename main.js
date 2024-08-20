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
	if (req.method === "POST") {
		const { email, name, phone } = JSON.parse(req.payload);
		const client = new Client();

		client.setEndpoint("https://cloud.appwrite.io/v1").setProject(PROJECT_ID);
		// .setKey()

		// const db = new Databases(client);

		// if (req.method == "GET") {
		// 	const response = await db.listDocuments(DB_ID, COLLECTION_ID);

		// 	return res.json(response.documents);
		// }

		// const users = new Users(client);
		// const headers = req.headers;
		// const userId = headers["x-appwrite-user-id"];

		// const result = await users.createTarget(
		// 	userId,
		// 	ID.unique(), // targetId
		// 	MessagingProviderType.Email, // providerType
		// 	"email", // identifier
		// 	"<PROVIDER_ID>", // providerId (optional)
		// 	"<NAME>" // name (optional)
		// );

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
	} else {
		res.json({
			status: "Invalid request method",
			error: `Expected POST, received ${req.method}`,
		});
	}

	// return res.send("Hello");
};
