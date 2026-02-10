const LeaveRequest = require('../models/LeaveRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendLeaveSubmissionEmail, sendLeaveStatusEmail } = require('../utils/emailService');

exports.submitRequest = async (req, res) => {
    try {
        const {
            studentId, studentName, studentEmail, className,
            teacherId, teacherName, leaveType, startDate,
            endDate, totalDays, reason, parentContact, parentEmail
        } = req.body;

        const leave = await LeaveRequest.create({
            studentId,
            studentName,
            studentEmail: studentEmail || req.user.email,
            className,
            teacherId, teacherName, leaveType, startDate,
            endDate, totalDays, reason, parentContact, parentEmail
        });

        // Create notification for student
        await Notification.create({
            studentId,
            leaveId: leave.id,
            type: 'FILED',
            title: 'Application Filed',
            message: `Your ${leaveType} request for ${totalDays} days has been submitted for review.`
        });

        // Fetch teacher's email for notification
        const teacher = await User.findByPk(teacherId);

        // Send email notification to both student and teacher
        await sendLeaveSubmissionEmail(leave, teacher?.email);

        res.status(201).json({ message: 'Leave request submitted successfully', leave });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTeacherRequests = async (req, res) => {
    try {
        const { teacherId } = req.query;
        const requests = await LeaveRequest.findAll({
            where: { teacherId },
            order: [['submittedAt', 'DESC']]
        });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRequestById = async (req, res) => {
    try {
        const request = await LeaveRequest.findByPk(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.processRequest = async (req, res) => {
    try {
        const { status, teacherComment, processedBy } = req.body;
        const leave = await LeaveRequest.findByPk(req.params.id);
        if (!leave) return res.status(404).json({ message: 'Request not found' });

        leave.status = status;
        leave.teacherComment = teacherComment;
        leave.processedAt = new Date();
        leave.processedBy = processedBy;
        await leave.save();

        // Create notification for student
        await Notification.create({
            studentId: leave.studentId,
            leaveId: leave.id,
            type: status.toUpperCase(),
            title: `Leave ${status}`,
            message: `Your leave request for ${leave.leaveType} has been ${status}. ${teacherComment ? `Comment: ${teacherComment}` : ''}`
        });

        // Send email notification
        await sendLeaveStatusEmail(leave, status, teacherComment);

        res.json({ message: `Leave request ${status} successfully`, leave });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStudentNotifications = async (req, res) => {
    try {
        const { studentId } = req.params;
        const notifications = await Notification.findAll({
            where: { studentId },
            order: [['createdAt', 'DESC']]
        });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStudentRequests = async (req, res) => {
    try {
        const { studentId } = req.query;
        const requests = await LeaveRequest.findAll({
            where: { studentId },
            order: [['submittedAt', 'DESC']]
        });
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
