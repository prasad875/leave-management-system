const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Leave MS" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Email error:', error);
        return false;
    }
};

const sendLeaveSubmissionEmail = async (leave, teacherEmail) => {
    const subject = `New Leave Request: ${leave.studentName}`;
    const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563eb;">New Leave Application</h2>
        <p><strong>Student Name:</strong> ${leave.studentName}</p>
        <p><strong>Student Email:</strong> ${leave.studentEmail}</p>
        <p><strong>Class:</strong> ${leave.className}</p>
        <p><strong>Leave Type:</strong> ${leave.leaveType}</p>
        <p><strong>Duration:</strong> ${leave.startDate} to ${leave.endDate} (${leave.totalDays} days)</p>
        <p><strong>Reason:</strong> ${leave.reason}</p>
        <p><strong>Parent Contact:</strong> ${leave.parentContact}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">This is an automated notification from LeaveMS.</p>
    </div>
    `;

    // Send to student (confirmation)
    await sendEmail(leave.studentEmail, subject, html);

    // Send to teacher (for review) if email exists
    if (teacherEmail) {
        await sendEmail(teacherEmail, subject, html);
    }

    // Send to parent for awareness
    if (leave.parentEmail) {
        await sendEmail(leave.parentEmail, subject, html);
    }

    return true;
};

const sendLeaveStatusEmail = async (leave, status, comment) => {
    const subject = `Leave Request ${status.toUpperCase()}: ${leave.leaveType}`;
    const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: ${status === 'approved' ? '#10b981' : '#ef4444'}; text-transform: uppercase;">Leave Request ${status}</h2>
        <p>Hello,</p>
        <p>The leave request for <strong>${leave.studentName}</strong> from <strong>${leave.startDate}</strong> to <strong>${leave.endDate}</strong> has been <strong>${status}</strong>.</p>
        ${comment ? `<div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px;"><strong>Teacher's Remark:</strong> ${comment}</div>` : ''}
        <p style="margin-top: 20px;">Please check the LeaveMS dashboard for full details.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 11px; color: #999;">Automated synchronization via Triple-Layer Alert System.</p>
    </div>
    `;

    // Send to student
    await sendEmail(leave.studentEmail, subject, html);

    // Send to parent if available
    if (leave.parentEmail) {
        await sendEmail(leave.parentEmail, subject, html);
    }

    return true;
};

module.exports = {
    sendLeaveSubmissionEmail,
    sendLeaveStatusEmail
};
