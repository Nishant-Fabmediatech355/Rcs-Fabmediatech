import { Op } from "sequelize";
import TBLSMSReports from "../../../models/tblSMSReport.js";
import TotalLogs from "../../../models/totalLogs.js";
import APISMSReport from "../../../models/apiSMSReport.js";
import sequelize from "../../../config/db1.js";

export const getSmsUploadIdsByCustomerId = async (req, res) => {
    try {
        const {
            fromDate,
            toDate,
            file_status,
            key,
            page = 1,
            limit = 10,
        } = req.query;
        const pageInt = parseInt(page);
        const limitInt = parseInt(limit);
        const offset = (pageInt - 1) * limitInt;
        const { userId, role } = req.authData;

        if (key === "API") {
            const where = {};

            if (fromDate && toDate) {
                where.createdAt = {
                    [Op.between]: [
                        new Date(`${fromDate}T00:00:00.000Z`),
                        new Date(`${toDate}T23:59:59.999Z`),
                    ],
                };
            }
            const { count, rows: apiData } = await APISMSReport.findAndCountAll({
                where,
                attributes: [
                    "api_report_id",
                    "api_campaign_id",
                    "customer_id",
                    "smsText",
                    "sender_id",
                    "sms_status",
                    "sms_Count",
                    "template_id",
                    "PE_ID",
                    "route_id",
                    "createdAt",
                    "ph_no",
                    "stat",
                ],
                limit: limitInt,
                offset: offset,
                raw: true,
            });

            return res.status(200).json({
                status: true,
                data: apiData,
                total: count,
                page: pageInt,
                limit: limitInt,
            });
        }
        const where = {};

        if (req.query.senderId) {
            where.header_name = req.query.senderId;
        }

        if (file_status) {
            where.file_status = file_status;
        }

        if (fromDate && toDate) {
            where.createdAt = {
                [Op.between]: [
                    new Date(`${fromDate}T00:00:00.000Z`),
                    new Date(`${toDate}T23:59:59.999Z`),
                ],
            };
        }

        const smsUploads = await TotalLogs.findAll({
            where,
            attributes: [
                "campaign_id",
                "createdAt",
                "file_status",
                "total_numbers",
                "msgCount",
                "smsText",
                "header_name",
                "customer_id",
            ],
            limit: limitInt,
            offset: offset,
        });

        const totalCount = await TotalLogs.count({ where });

        if (totalCount === 0) {
            return res.status(200).json({
                message: "No records found.",
                status: true,
                data: [],
                total: 0,
            });
        }

        const result = await Promise.all(
            smsUploads.map(async (upload) => {
                const [sentCount, failedCount] = await Promise.all([
                    TBLSMSReports.count({
                        where: { campaign_id: upload.campaign_id, stat: "sent" },
                    }),
                    TBLSMSReports.count({
                        where: { campaign_id: upload.campaign_id, stat: "FAILED" },
                    }),
                ]);

                return {
                    ...upload.get({ plain: true }),
                    total_count: (upload.total_numbers || 0) * (upload.msgCount || 1),
                    sent_count: sentCount,
                    failed_count: failedCount,
                };
            })
        );

        return res.status(200).json({
            status: true,
            data: result,
            total: totalCount,
            page: pageInt,
            limit: limitInt,
        });
    } catch (error) {
        console.error(" Error in getSmsUploadIdsByCustomerId:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const searchCustomerSMSUploads = async (req, res) => {
    try {
        const { customer_id, sender_id, key } = req.query;

        if (!customer_id && !sender_id) {
            return res.status(400).json({
                status: false,
                message: "Please provide at least customer_id or sender_id to search.",
            });
        }

        const where = {};

        if (customer_id) {
            where.customer_id = customer_id;
        }

        if (sender_id) {
            where.header_name = sender_id;
        }

        if (key === "API") {
            // API-based search
            if (sender_id) where.sender_id = sender_id;
            const apiResults = await APISMSReport.findAll({
                where,
                attributes: [
                    "api_campaign_id",
                    "customer_id",
                    "smsText",
                    "sender_id",
                    "sms_status",
                    "sms_Count",
                    "template_id",
                    "PE_ID",
                    "route_id",
                    "createdAt",
                    "ph_no",
                    "stat",
                ],
                order: [["api_campaign_id", "DESC"]],
                raw: true,
            });

            return res.status(200).json({
                status: true,
                message: "API Search results",
                data: apiResults,
            });
        }

        // Manual upload search
        const manualResults = await TotalLogs.findAll({
            where,
            attributes: [
                "campaign_id",
                "createdAt",
                "file_status",
                "total_numbers",
                "msgCount",
                "smsText",
                "header_name",
                "customer_id",
            ],
            order: [["createdAt", "DESC"]],
            raw: true,
        });

        return res.status(200).json({
            status: true,
            message: "Manual Search results",
            data: manualResults,
        });
    } catch (error) {
        console.error("Error in searchCustomerSMSUploads:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


export const searchNumbersByCustomer = async (req, res) => {
    try {
        const { customer_id, mobile, month, year } = req.query;

        if (!customer_id) {
            return res.status(400).json({
                status: false,
                message: "Customer ID is required",
            });
        }

        const where = {
            customer_id: customer_id
        };

        if (mobile) {
            where.ph_no = mobile;
        }

        if (month && year) {
            const startDate = new Date(`${year}-${month}-01`);
            const endDate = new Date(year, month, 0); // Last day of month

            where.createdAt = {
                [Op.between]: [startDate, endDate]
            };
        }

        const results = await APISMSReport.findAll({
            where,
            attributes: [
                "createdAt",
                "ph_no",
                "sender_id",
                "stat",
                "errCode",
                "smsText"
            ],
            order: [["createdAt", "DESC"]],
            raw: true
        });
        console.log(results, "--------------------->results");

        return res.status(200).json({
            status: true,
            data: results.map(item => ({
                date: item.createdAt,
                mobile: item.ph_no,
                senderId: item.sender_id,
                result: item.stat,
                description: item.errCode || 'Success',
                smsText: item.smsText
            }))
        });

    } catch (error) {
        console.error("Error in searchNumbersByCustomer:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};