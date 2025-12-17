const bdleadsModells = require("../../modells/BD/leadModells");
const userModells = require("../../modells/user/userModells");
const mongoose =require("mongoose")

const createBDlead = async function (req, res) {
  try {
    const body = req.body;

    // ----------------------------
    // 1. REQUIRED FIELD VALIDATION
    //-----------------------------
    const requiredFields = [
      "name",
      "contact_details.mobile",
      "address.village",
      "address.district",
      "address.state",
      "project_details.capacity",
      "source.from",
      "source.sub_source",
      "comments",
    ];

    const isMissing = requiredFields.some((path) => {
      const keys = path.split(".");
      let current = body;
      for (const key of keys) {
        current = current?.[key];
        if (!current) return true;
      }
      return false;
    });

    if (isMissing) {
      return res
        .status(400)
        .json({ error: "Please fill all required fields." });
    }

    //----------------------------------
    // 2. CHECK DUPLICATE LEAD (MOBILE)
    //----------------------------------
    const mobiles = (body?.contact_details?.mobile || []).map((m) =>
      m.trim()
    );

    const existingLead = await bdleadsModells.aggregate([
      {
        $match: {
          $expr: {
            $gt: [
              {
                $size: {
                  $setIntersection: [
                    mobiles,
                    {
                      $map: {
                        input: "$contact_details.mobile",
                        as: "m",
                        in: { $trim: { input: "$$m" } },
                      },
                    },
                  ],
                },
              },
              0,
            ],
          },
        },
      },
      { $limit: 1 },
    ]);

    if (existingLead.length > 0) {
      return res.status(400).json({
        error: "Lead already exists with the provided mobile number!",
      });
    }

    //------------------------------------
    // 3. AUTO-GENERATE NEXT LEAD ID
    //------------------------------------
    const lastLead = await bdleadsModells.aggregate([
      { $match: { id: { $regex: /^BD\/Lead\// } } },
      {
        $addFields: {
          numericId: {
            $toInt: { $arrayElemAt: [{ $split: ["$id", "/"] }, -1] },
          },
        },
      },
      { $sort: { numericId: -1 } },
      { $limit: 1 },
    ]);

    const lastNumber = lastLead?.[0]?.numericId || 0;
    const nextId = `BD/Lead/${lastNumber + 1}`;

    //------------------------------------
    // 4. BUILD FINAL PAYLOAD
    //------------------------------------
    const user_id = req.user.userId;

    const payload = {
      ...body,
      id: nextId,
      submitted_by: user_id,
      assigned_to: [
        {
          user_id: user_id,
          status: "",
        },
      ],
    };

    //------------------------------------
    // 5. SAVE TO DATABASE
    //------------------------------------
    const bdLead = new bdleadsModells(payload);
    await bdLead.save();

    //------------------------------------
    // 6. RESPONSE
    //------------------------------------
    res.status(200).json({
      message: "BD Lead created successfully",
      data: bdLead,
    });
  } catch (error) {
    res.status(400).json({ error: error.message || "Something went wrong" });
  }
};


//get all lead
const getAllLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      fromDate,
      toDate,
      stage,
      lead_without_task,
      handover_statusFilter,
      name,
    } = req.query;

    const userId = req.user.userId;
    const user = await userModells.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPrivilegedUser =
      ["admin", "superadmin"].includes(user.department) ||
      (user.department === "BD" && user.role === "manager");

    const match = {};
    const and = [];

    // 🔍 Search filter
    if (search) {
      and.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { "contact_details.mobile": { $regex: search, $options: "i" } },
          { "project_details.scheme": { $regex: search, $options: "i" } },
          { id: { $regex: search, $options: "i" } },
          { "current_status.name": { $regex: search, $options: "i" } },
        ],
      });
    }

    // 🔐 Normal BD users can only see their assigned leads
    if (!isPrivilegedUser) {
      and.push({ "assigned_to.user_id": new mongoose.Types.ObjectId(userId) });
    }

    // 🎯 Stage filter
    if (stage && stage !== "lead_without_task") {
      and.push({ "current_status.name": stage });
    }

    // 📅 Date filter
    if (fromDate && toDate) {
      const start = new Date(fromDate);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      and.push({ createdAt: { $gte: start, $lte: end } });
    }

    // 🚫 Lead without task filter
    if (lead_without_task === "true") {
      const leadsWithPendingTasks = await task.aggregate([
        { $match: { current_status: { $ne: "completed" } } },
        { $group: { _id: "$lead_id" } },
      ]);

      const leadsToExclude = leadsWithPendingTasks.map((doc) => doc._id);

      and.push({
        $and: [
          { _id: { $nin: leadsToExclude } },
          { "current_status.name": { $ne: "won" } },
        ],
      });
    }

    if (and.length) match.$and = and;

    const pipeline = [
      { $match: match },

      // 📝 Handover lookup
      {
        $lookup: {
          from: "handoversheets",
          let: { leadId: "$id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    { $trim: { input: { $toString: "$id" } } },
                    { $trim: { input: { $toString: "$$leadId" } } },
                  ],
                },
              },
            },
            { $project: { _id: 1, status_of_handoversheet: 1 } },
          ],
          as: "handover_info",
        },
      },

      // 🛠️ Assign handover_status
      {
        $addFields: {
          handover_status: {
            $cond: [
              { $gt: [{ $size: "$handover_info" }, 0] },
              {
                $switch: {
                  branches: [
                    { case: { $eq: [ { $toLower: "$handover_info.status_of_handoversheet" }, "draft" ] }, then: "in process" },
                    { case: { $eq: [ { $toLower: "$handover_info.status_of_handoversheet" }, "rejected" ] }, then: "rejected" },
                    { case: { $eq: [ { $toLower: "$handover_info.status_of_handoversheet" }, "submitted" ] }, then: "completed" },
                  ],
                  default: "unknown",
                },
              },
              "pending",
            ],
          },
        },
      },

      // 🧵 Assigned user population
      {
        $lookup: {
          from: "users",
          localField: "assigned_to.user_id",
          foreignField: "_id",
          pipeline: [{ $project: { _id: 1, name: 1 } }],
          as: "assigned_user_objs",
        },
      },
      {
        $addFields: {
          assigned_to: {
            $map: {
              input: "$assigned_to",
              as: "a",
              in: {
                _id: "$$a._id",
                status: "$$a.status",
                user_id: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$assigned_user_objs",
                        as: "u",
                        cond: { $eq: ["$$u._id", "$$a.user_id"] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      { $project: { assigned_user_objs: 0 } },

      // 👤 Populate submitted_by
      {
        $lookup: {
          from: "users",
          localField: "submitted_by",
          foreignField: "_id",
          pipeline: [{ $project: { _id: 1, name: 1 } }],
          as: "submitted_by_user",
        },
      },
      {
        $addFields: {
          submitted_by: { $arrayElemAt: ["$submitted_by_user", 0] },
        },
      },
      { $project: { submitted_by_user: 0 } },

      // Sort + Pagination
      { $sort: { createdAt: -1 } },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
    ];

    const totalCountAgg = await bdleadsModells.aggregate([
      { $match: match },
      { $count: "count" },
    ]);

    const total = totalCountAgg[0]?.count || 0;
    const leads = await bdleadsModells.aggregate(pipeline);

    return res.status(200).json({
      message: "BD Leads fetched successfully",
      total,
      page: +page,
      limit: +limit,
      leads,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

const updateLeadStatus = async function (req, res) {
  try {
    const leads = await bdleadsModells.findById(req.params._id);
    if (!leads) return res.status(404).json({ error: "Lead not found" });

    const user_id = req.user.userId;

    leads.status_history.push({
      ...req.body,
      user_id: user_id,
    });

    if (
      leads.expected_closing_date === undefined ||
      leads.expected_closing_date === null
    ) {
      leads.expected_closing_date = req.body.expected_closing_date;
    }

    await leads.save();
    res.status(200).json(leads);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports={
    createBDlead,
    getAllLeads,
    updateLeadStatus,
}