const {mailSender} = require("./utils/mailSender"); // Assuming mailSender.js is in the same directory


async function testEmail() {
    const email = "adithvijay121@gmail.com"; // Replace with a valid email address
    const title = "Test Email Subject";
    const body = "<h1>This is a test email</h1><p>Your OTP is: 123456</p>"; // Example body

    try {
        const response = await mailSender(email,title,body);
        console.log("Email sent successfully: ", response);
    } catch (error) {
        console.error("Error sending email: ", error);
    }
}

testEmail();