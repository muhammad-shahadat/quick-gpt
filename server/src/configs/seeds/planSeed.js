import Plan from "../../models/Plan.js";

export const seedPlans = async () => {
  try {
    const count = await Plan.countDocuments();

    if (count === 0) {
      const plans = [
        {
          name: "Basic",
          slug: "basic",
          price: 10,
          credits: 100,
          features: [
            "100 text generations",
            "50 image generations",
            "Standard support",
            "Access to basic models"
          ]
        },
        {
          name: "Pro",
          slug: "pro",
          price: 29,
          credits: 500,
          features: [
            "500 text generations",
            "200 image generations",
            "Priority support",
            "Access to advanced models"
          ]
        },
        {
          name: "Premium",
          slug: "premium",
          price: 79,
          credits: 2000,
          features: [
            "2000 text generations",
            "1000 image generations",
            "24/7 support",
            "Access to all AI models"
          ]
        }
      ];

      await Plan.insertMany(plans);
      console.log("✅ Plans seeded successfully!");
    } else {
      console.log("ℹ️ Plans already exist in the database. Skipping seed.");
    }
  } catch (error) {
    console.error("❌ Error seeding plans:", error);
  }
};